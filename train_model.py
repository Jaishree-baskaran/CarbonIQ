import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

# Generate synthetic dataset
np.random.seed(42)

data_size = 1000

electricity = np.random.uniform(50, 500, data_size)
distance = np.random.uniform(5, 200, data_size)
lpg = np.random.uniform(0.5, 3, data_size)

# Emission factors
electricity_factor = 0.82
transport_factor = 0.21
lpg_factor = 2.98 * 14.2

co2 = (
    electricity * electricity_factor
    + distance * transport_factor
    + lpg * lpg_factor
)

df = pd.DataFrame({
    "electricity": electricity,
    "distance": distance,
    "lpg": lpg,
    "co2": co2
})

X = df[["electricity","distance","lpg"]]
y = df["co2"]

X_train, X_test, y_train, y_test = train_test_split(
    X,y,test_size=0.2,random_state=42
)

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

model.fit(X_train,y_train)

pred = model.predict(X_test)

print("R2 Score:", r2_score(y_test,pred))
print("MAE:", mean_absolute_error(y_test,pred))

joblib.dump(model,"rf_model.pkl")

print("Model Saved Successfully")