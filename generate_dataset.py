import pandas as pd
import numpy as np
from datetime import datetime

np.random.seed(42)

rows = []
years = [2019, 2020, 2021, 2022, 2023]
months = list(range(1, 13))

profiles = [
    "Low_Emission",
    "Urban_Commuter",
    "High_Energy",
    "Transport_Heavy",
    "Sustainable"
]

for year in years:
    for month in months:
        for _ in range(5):  # 5 users per month
            profile = np.random.choice(profiles)
            if profile == "Low_Emission":
                electricity = np.random.uniform(50, 120)
                transport = np.random.uniform(20, 80)
                lpg = np.random.uniform(0.5, 1.2)

            elif profile == "Urban_Commuter":
                electricity = np.random.uniform(100, 250)
                transport = np.random.uniform(100, 300)
                lpg = np.random.uniform(1, 2)

            elif profile == "High_Energy":
                electricity = np.random.uniform(250, 500)
                transport = np.random.uniform(50, 150)
                lpg = np.random.uniform(1.5, 3)

            elif profile == "Transport_Heavy":
                electricity = np.random.uniform(100, 200)
                transport = np.random.uniform(300, 600)
                lpg = np.random.uniform(1, 2)

            else:  # Sustainable
                electricity = np.random.uniform(40, 100)
                transport = np.random.uniform(10, 50)
                lpg = np.random.uniform(0.3, 1)

            electricity_co2 = electricity * 0.82
            transport_co2 = transport * 0.21
            lpg_co2 = lpg * 14.2 * 2.98

            total = electricity_co2 + transport_co2 + lpg_co2

            rows.append([
                electricity,
                transport,
                lpg,
                electricity_co2,
                transport_co2,
                lpg_co2,
                total,
                month,
                year,
                profile
            ])
columns = [
    "Electricity_kWh",
    "Transport_km",
    "LPG_cylinders",
    "Electricity_CO2",
    "Transport_CO2",
    "LPG_CO2",
    "Total_CO2",
    "Month",
    "Year",
    "User_Profile"
]
df = pd.DataFrame(rows, columns=columns)
df.to_csv("synthetic_carbon_dataset.csv", index=False)
print("Dataset Generated Successfully!")
