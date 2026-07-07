import { MethaneSite, CityAQI, StatePolicy, IndiaNational } from "../types";

export const STATE_GRID_FACTORS: Record<string, number> = {
  "Andhra Pradesh":0.79,"Arunachal Pradesh":0.18,"Assam":0.62,"Bihar":0.95,
  "Chhattisgarh":1.02,"Goa":0.71,"Gujarat":0.88,"Haryana":0.91,
  "Himachal Pradesh":0.09,"Jharkhand":1.05,"Karnataka":0.58,"Kerala":0.41,
  "Madhya Pradesh":0.97,"Maharashtra":0.82,"Manipur":0.21,"Meghalaya":0.34,
  "Mizoram":0.19,"Nagaland":0.22,"Odisha":0.99,"Punjab":0.76,"Rajasthan":0.89,
  "Sikkim":0.14,"Tamil Nadu":0.71,"Telangana":0.85,"Tripura":0.55,
  "Uttar Pradesh":0.94,"Uttarakhand":0.17,"West Bengal":0.98,
  "Delhi":0.83,"Chandigarh":0.74,
};

export const STATE_PERCAPITA_CO2: Record<string, number> = {
  "Jharkhand":4.8,"Chhattisgarh":4.5,"Odisha":4.1,"Madhya Pradesh":3.8,
  "Uttar Pradesh":3.4,"Bihar":3.1,"Rajasthan":3.0,"Haryana":2.9,
  "Gujarat":2.8,"Maharashtra":2.6,"Telangana":2.5,"Andhra Pradesh":2.3,
  "West Bengal":2.2,"Karnataka":1.9,"Tamil Nadu":1.8,"Punjab":1.7,
  "Delhi":1.6,"Assam":1.4,"Kerala":1.2,"Himachal Pradesh":0.9,
  "Uttarakhand":0.8,"Sikkim":0.5,"Goa":1.1,"Manipur":0.6,
};

export const METHANE_LANDFILLS: Record<string, MethaneSite> = {
  "Secunderabad – Jawaharnagar": {
      "city":"Hyderabad","state":"Telangana","ch4_kt":48.2,"rank_global":3,
      "area_ha":247,"active_since":1986,"waste_daily_tonnes":2800,
      "source":"GHGSat / Carbon Mapper 2024",
      "note":"Ranked 3rd globally for landfill methane in 2025 satellite data. Covers 247 hectares of Hyderabad's outskirts."
  },
  "Deonar – Mumbai": {
      "city":"Mumbai","state":"Maharashtra","ch4_kt":41.7,"rank_global":7,
      "area_ha":132,"active_since":1927,"waste_daily_tonnes":3500,
      "source":"GHGSat / Carbon Mapper 2024",
      "note":"Asia's oldest active landfill, operational since 1927. Fires recorded every monsoon. Receives 3,500 tonnes/day."
  },
  "Bhalswa – Delhi": {
      "city":"Delhi","state":"Delhi","ch4_kt":36.4,"rank_global":12,
      "area_ha":54,"active_since":1994,"waste_daily_tonnes":2200,
      "source":"CPCB / SAFAR 2024",
      "note":"One of Delhi's three legacy landfills. The 'Bhalswa mountain' stands approximately 60 metres high."
  },
  "Ghazipur – Delhi": {
      "city":"Delhi","state":"Delhi","ch4_kt":34.1,"rank_global":15,
      "area_ha":70,"active_since":1984,"waste_daily_tonnes":2000,
      "source":"CPCB 2024",
      "note":"Taller than Qutub Minar. Partial collapse in 2017 killed 2 people. Scheduled for closure since 2002."
  },
  "Perungudi – Chennai": {
      "city":"Chennai","state":"Tamil Nadu","ch4_kt":18.3,"rank_global":41,
      "area_ha":140,"active_since":1980,"waste_daily_tonnes":1400,
      "source":"CPCB 2024",
      "note":"Officially closed in 2016 but continues to receive waste. Located near Pallikaranai marshland."
  },
  "Brahmapuram – Kochi": {
      "city":"Kochi","state":"Kerala","ch4_kt":12.1,"rank_global":68,
      "area_ha":100,"active_since":2005,"waste_daily_tonnes":900,
      "source":"CPCB / Kerala PCB 2024",
      "note":"Massive fire in March 2023 burned for weeks, spreading toxic smoke across Kochi and surrounding districts."
  },
};

export const CITY_AQI: Record<string, CityAQI> = {
  "Delhi":{"aqi":312,"pm25":89.4,"pm10":178,"no2":52,"so2":18,"category":"Very Poor"},
  "Mumbai":{"aqi":164,"pm25":42.1,"pm10":98,"no2":38,"so2":12,"category":"Moderate"},
  "Kolkata":{"aqi":198,"pm25":58.3,"pm10":124,"no2":44,"so2":16,"category":"Poor"},
  "Chennai":{"aqi":89,"pm25":22.1,"pm10":61,"no2":28,"so2":8,"category":"Satisfactory"},
  "Hyderabad":{"aqi":121,"pm25":31.4,"pm10":88,"no2":35,"so2":10,"category":"Moderate"},
  "Bengaluru":{"aqi":94,"pm25":24.8,"pm10":67,"no2":30,"so2":9,"category":"Satisfactory"},
  "Ahmedabad":{"aqi":187,"pm25":52.3,"pm10":141,"no2":41,"so2":15,"category":"Poor"},
  "Pune":{"aqi":108,"pm25":27.9,"pm10":72,"no2":32,"so2":9,"category":"Moderate"},
  "Jaipur":{"aqi":224,"pm25":64.2,"pm10":158,"no2":46,"so2":19,"category":"Poor"},
  "Lucknow":{"aqi":267,"pm25":78.1,"pm10":166,"no2":49,"so2":21,"category":"Very Poor"},
  "Patna":{"aqi":289,"pm25":83.4,"pm10":172,"no2":51,"so2":22,"category":"Very Poor"},
  "Kanpur":{"aqi":298,"pm25":86.2,"pm10":174,"no2":53,"so2":23,"category":"Very Poor"},
  "Varanasi":{"aqi":241,"pm25":69.8,"pm10":161,"no2":47,"so2":20,"category":"Poor"},
  "Nagpur":{"aqi":134,"pm25":35.6,"pm10":91,"no2":36,"so2":11,"category":"Moderate"},
  "Surat":{"aqi":148,"pm25":39.2,"pm10":94,"no2":37,"so2":13,"category":"Moderate"},
  "Visakhapatnam":{"aqi":118,"pm25":30.1,"pm10":84,"no2":34,"so2":10,"category":"Moderate"},
  "Kochi":{"aqi":72,"pm25":17.4,"pm10":48,"no2":24,"so2":7,"category":"Good"},
  "Coimbatore":{"aqi":81,"pm25":20.2,"pm10":54,"no2":26,"so2":7,"category":"Satisfactory"},
  "Chandigarh":{"aqi":178,"pm25":49.1,"pm10":112,"no2":40,"so2":14,"category":"Moderate"},
  "Bhopal":{"aqi":156,"pm25":41.8,"pm10":99,"no2":38,"so2":13,"category":"Moderate"},
};

export const STATE_POLICIES: Record<string, StatePolicy> = {
  "Kerala":{"ren_pct":52,"ev_policy":"Yes","green_rating":"A+","target_year":2030,"key_policy":"Kerala EV Policy 2023 — 1 lakh EVs by 2025. 100% renewable power target by 2040."},
  "Karnataka":{"ren_pct":48,"ev_policy":"Yes","green_rating":"A","target_year":2030,"key_policy":"Karnataka RE Policy 2022 — 10 GW solar by 2025. Bengaluru green mobility plan."},
  "Tamil Nadu":{"ren_pct":44,"ev_policy":"Yes","green_rating":"A","target_year":2030,"key_policy":"Tamil Nadu Green Energy Policy — 20 GW wind + solar by 2030."},
  "Gujarat":{"ren_pct":38,"ev_policy":"Yes","green_rating":"B+","target_year":2030,"key_policy":"Hybrid & EV Policy 2021. Rann of Kutch solar park — world's largest single-site solar farm."},
  "Rajasthan":{"ren_pct":41,"ev_policy":"Yes","green_rating":"B+","target_year":2030,"key_policy":"Rajasthan Solar Energy Policy 2019 — 30 GW solar target."},
  "Maharashtra":{"ren_pct":29,"ev_policy":"Yes","green_rating":"B","target_year":2030,"key_policy":"Maharashtra EV Policy 2021. Mumbai coastal road sustainability mandate."},
  "Telangana":{"ren_pct":34,"ev_policy":"Yes","green_rating":"B","target_year":2030,"key_policy":"Telangana Solar Power Policy 2020. Hyderabad metro expansion phase 3."},
  "Andhra Pradesh":{"ren_pct":37,"ev_policy":"Yes","green_rating":"B","target_year":2030,"key_policy":"AP EV Policy 2023. Renewable energy target 18 GW by 2027."},
  "Delhi":{"ren_pct":12,"ev_policy":"Yes","green_rating":"C+","target_year":2025,"key_policy":"Delhi EV Policy 2020 — 25% EVs by 2024. BS-VI fuel mandate. Odd-even scheme."},
  "Uttar Pradesh":{"ren_pct":14,"ev_policy":"Yes","green_rating":"C","target_year":2030,"key_policy":"UP EV Manufacturing Policy 2022. Bundelkhand solar park."},
  "Bihar":{"ren_pct":8,"ev_policy":"No","green_rating":"D","target_year":2035,"key_policy":"Bihar RE Policy 2017 — limited implementation. High coal dependency."},
  "Jharkhand":{"ren_pct":9,"ev_policy":"No","green_rating":"D","target_year":2035,"key_policy":"Coal mining state — transition plan under development. Damodar Valley thermal plants."},
  "Chhattisgarh":{"ren_pct":11,"ev_policy":"No","green_rating":"D","target_year":2035,"key_policy":"Solar park development in early stage. Heavy industrial emission zone."},
  "West Bengal":{"ren_pct":16,"ev_policy":"No","green_rating":"C","target_year":2030,"key_policy":"West Bengal Solar Policy 2017. Kolkata tram network — oldest in Asia."},
  "Punjab":{"ren_pct":22,"ev_policy":"Yes","green_rating":"C+","target_year":2030,"key_policy":"Punjab EV Policy 2022. Paddy stubble burning remains major seasonal air issue."},
  "Himachal Pradesh":{"ren_pct":88,"ev_policy":"Yes","green_rating":"A+","target_year":2025,"key_policy":"Near 100% hydro power. Green state declaration 2018."},
  "Uttarakhand":{"ren_pct":84,"ev_policy":"Yes","green_rating":"A+","target_year":2025,"key_policy":"Hydro-dominant grid. Char Dham green zone policy."},
  "Sikkim":{"ren_pct":91,"ev_policy":"Yes","green_rating":"A+","target_year":2022,"key_policy":"India's first fully organic state. 100% renewable power achieved."},
  "Goa":{"ren_pct":18,"ev_policy":"Yes","green_rating":"B-","target_year":2030,"key_policy":"Goa Clean Mobility Policy 2023. Tourism-focused green infrastructure."},
  "Odisha":{"ren_pct":13,"ev_policy":"No","green_rating":"D+","target_year":2035,"key_policy":"Odisha RE Policy 2022 — 10 GW target. Heavy industry + coal dependent."},
  "Madhya Pradesh":{"ren_pct":28,"ev_policy":"Yes","green_rating":"C+","target_year":2030,"key_policy":"MP Solar Energy Policy 2022. Rewa solar park — 750 MW."},
  "Haryana":{"ren_pct":19,"ev_policy":"Yes","green_rating":"C","target_year":2030,"key_policy":"Haryana EV Policy 2022. Gurugram air emergency measures."},
  "Assam":{"ren_pct":24,"ev_policy":"No","green_rating":"C-","target_year":2030,"key_policy":"Assam Solar Policy 2020. Oil refinery emission norms tightened."},
};

export const INDIA_NATIONAL: IndiaNational = {
  "total_co2_gt":3.9,"rank_global":3,"percapita_tonnes":1.9,
  "renewable_pct":43,"coal_pct":51,"forest_cover_pct":21.7,
  "ev_sales_2024":1680000,"solar_gw":82,"wind_gw":47,
  "ndc_target":"45% emissions intensity reduction by 2030 vs 2005",
  "net_zero_target":2070,
};

export const AQI_COLORS: Record<string, string> = {
  "Good":"#4ade80","Satisfactory":"#86efac","Moderate":"#fbbf24",
  "Poor":"#f97316","Very Poor":"#f87171","Severe":"#dc2626",
};
