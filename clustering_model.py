import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import joblib

# Load dataset
df = pd.read_csv("synthetic_carbon_dataset.csv")

# Select features for clustering
features = df[[
    "Electricity_kWh",
    "Transport_km",
    "LPG_cylinders",
    "Total_CO2"
]]

# Normalize data
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

# Apply KMeans
kmeans = KMeans(n_clusters=4, random_state=42)
df["Cluster"] = kmeans.fit_predict(scaled_features)

print("Clustering Completed Successfully!")

# Save updated dataset
df.to_csv("synthetic_carbon_clustered.csv", index=False)

# Analyze cluster centers
centers = pd.DataFrame(
    scaler.inverse_transform(kmeans.cluster_centers_),
    columns=features.columns
)

print("\nCluster Centers (Original Scale):")
print(centers)

# Optional visualization
plt.scatter(df["Electricity_kWh"], df["Total_CO2"], c=df["Cluster"])
plt.xlabel("Electricity_kWh")
plt.ylabel("Total_CO2")
plt.title("Cluster Visualization")
plt.show()

# Automatically label clusters based on Total_CO2 mean
cluster_means = df.groupby("Cluster")["Total_CO2"].mean()

sorted_clusters = cluster_means.sort_values().index.tolist()

cluster_labels = {
    sorted_clusters[0]: "Low Impact Household",
    sorted_clusters[1]: "Moderate Impact User",
    sorted_clusters[2]: "High Energy Consumer",
    sorted_clusters[3]: "High Carbon Risk User"
}

df["Cluster_Label"] = df["Cluster"].map(cluster_labels)

# Save final labeled dataset
df.to_csv("synthetic_carbon_clustered.csv", index=False)

print("\nCluster Labeling Completed!")
# Save model and scaler
joblib.dump(kmeans, "kmeans_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Model and Scaler Saved Successfully!")