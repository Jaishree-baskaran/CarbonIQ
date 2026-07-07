"""
CarbonIQ – Flask Backend
────────────────────────
Serves two ML endpoints:
  POST /predict  → Random Forest CO₂ prediction + risk score
  POST /cluster  → KMeans cluster label

Run:
    pip install flask flask-cors joblib scikit-learn pandas
    python backend.py

The Streamlit app.py calls these instead of loading models directly.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # allow Streamlit (localhost:8501) to call this

# ── Load models once at startup ─────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))

def load(name):
    path = os.path.join(BASE, name)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")
    return joblib.load(path)

try:
    rf_model       = load("rf_model.pkl")
    scaler         = load("scaler.pkl")
    kmeans         = load("kmeans_model.pkl")
    clustered_df   = pd.read_csv(os.path.join(BASE, "synthetic_carbon_clustered.csv"))
    print("All models loaded successfully.")
except Exception as e:
    print(f"Startup error: {e}")
    rf_model = scaler = kmeans = clustered_df = None


# ── Helper ──────────────────────────────────────────────────────────────────
def validate(data, fields):
    missing = [f for f in fields if f not in data]
    if missing:
        return None, {"error": f"Missing fields: {missing}"}
    return {f: data[f] for f in fields}, None


# ── Routes ──────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "models_loaded": rf_model is not None,
        "endpoints": ["/predict", "/cluster"]
    })


@app.route("/predict", methods=["POST"])
def predict():
    """
    Input JSON:
        {
            "units":     200,      // electricity kWh/month
            "distance":  50,       // travel km/week
            "cylinders": 1         // LPG cylinders/month
        }

    Response JSON:
        {
            "electricity_co2": 164.0,
            "transport_co2":   10.5,
            "lpg_co2":         42.3,
            "total_co2":       216.8,
            "predicted_co2":   210.4,
            "risk_score":      35.1
        }
    """
    if rf_model is None:
        return jsonify({"error": "Models not loaded"}), 500

    body, err = validate(request.get_json(force=True), ["units", "distance", "cylinders"])
    if err:
        return jsonify(err), 400

    try:
        units     = float(body["units"])
        distance  = float(body["distance"])
        cylinders = float(body["cylinders"])
        transport = str(body.get("transport", "Car"))
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    transport_factors = {"Car": 0.21, "Bike": 0.09, "Bus": 0.05}
    t_factor = transport_factors.get(transport, 0.21)

    elec_co2  = round(units     * 0.82,  2)
    trans_co2 = round(distance  * t_factor, 2)
    lpg_co2   = round(cylinders * 14.2 * 2.98, 2)
    total_co2 = round(elec_co2 + trans_co2 + lpg_co2, 2)

    predicted = round(float(rf_model.predict([[units, distance, cylinders]])[0]), 2)
    risk      = round(min((predicted / 600) * 100, 100), 1)

    return jsonify({
        "electricity_co2": elec_co2,
        "transport_co2":   trans_co2,
        "lpg_co2":         lpg_co2,
        "total_co2":       total_co2,
        "predicted_co2":   predicted,
        "risk_score":      risk
    })


@app.route("/cluster", methods=["POST"])
def cluster():
    """
    Input JSON:
        {
            "units":     200,
            "distance":  50,
            "cylinders": 1,
            "total_co2": 216.8
        }

    Response JSON:
        {
            "cluster_id":    2,
            "cluster_label": "Moderate Emission User"
        }
    """
    if kmeans is None:
        return jsonify({"error": "Models not loaded"}), 500

    body, err = validate(request.get_json(force=True), ["units", "distance", "cylinders", "total_co2"])
    if err:
        return jsonify(err), 400

    try:
        features = [[
            float(body["units"]),
            float(body["distance"]),
            float(body["cylinders"]),
            float(body["total_co2"])
        ]]
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    scaled      = scaler.transform(features)
    cluster_id  = int(kmeans.predict(scaled)[0])
    label_row   = clustered_df[clustered_df["Cluster"] == cluster_id]

    if label_row.empty:
        label = "Unknown Profile"
    else:
        label = label_row["Cluster_Label"].values[0]

    return jsonify({
        "cluster_id":    cluster_id,
        "cluster_label": label
    })


# ── Start ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)