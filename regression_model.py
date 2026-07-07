import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
# Load dataset
df = pd.read_csv("synthetic_carbon_dataset.csv")

# Features and target
X = df[["Electricity_kWh", "Transport_km", "LPG_cylinders"]]
y = df["Total_CO2"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)

print("R2 Score:", r2_score(y_test, predictions))
print("MAE:", mean_absolute_error(y_test, predictions))

# Save model
joblib.dump(model, "regression_model.pkl")

print("Regression Model Saved Successfully!")