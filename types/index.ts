export interface EmissionRecord {
  id: string;
  user_id: string;
  electricity_kwh: number;
  commute_km: number;
  vehicle_type: string;
  lpg_cylinders: number;
  total_co2: number;
  risk_score: number;
  cluster_label: string;
  state: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface VillageData {
  crops: { type: string; area: number; stubble: number };
  water: { pollution: string; ch4: number };
  electricity: { usage: number };
  transport: { tractors: number; commercial: number };
  households: { families: number };
  waste: { dumpSites: number; composting: number };
  perCapita: number;
}

export interface StatePolicy {
  ren_pct: number;
  ev_policy: string;
  green_rating: string;
  target_year: number;
  key_policy: string;
}

export interface CityAQI {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  category: string;
}

export interface MethaneSite {
  city: string;
  state: string;
  ch4_kt: number;
  rank_global: number;
  area_ha: number;
  active_since: number;
  waste_daily_tonnes: number;
  source: string;
  note: string;
}

export interface IndiaNational {
  total_co2_gt: number;
  rank_global: number;
  percapita_tonnes: number;
  renewable_pct: number;
  coal_pct: number;
  forest_cover_pct: number;
  ev_sales_2024: number;
  solar_gw: number;
  wind_gw: number;
  ndc_target: string;
  net_zero_target: number;
}
