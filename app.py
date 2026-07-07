import streamlit as st
import pandas as pd
import os
import requests as req
from groq import Groq

st.set_page_config(
    page_title="CarbonIQ India",
    page_icon="C",
    layout="wide",
    initial_sidebar_state="expanded"
)

import streamlit as st
from streamlit.components.v1 import html

st.set_page_config(
    page_title="CO2 • vayundhra",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS + Animations
custom_css = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Poppins:wght@300;400;600&display=swap');

    :root {
        --mint: #A8E6CF;
        --sage: #4CAF9C;
        --sky: #81D4FA;
        --peach: #FFCCBC;
        --cream: #FFF8F0;
    }

    .stApp {
        background: linear-gradient(135deg, #F0FFF4 0%, #E0F7FA 100%);
        font-family: 'Poppins', sans-serif;
    }

    .header {
        text-align: center;
        padding: 2rem 0;
        background: rgba(255,255,255,0.85);
        border-radius: 30px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(168,230,207,0.3);
        position: relative;
        overflow: hidden;
    }

    .vayundhra {
        font-size: 4.5rem;
        animation: float 3s ease-in-out infinite;
        display: inline-block;
        margin-bottom: 1rem;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(-5deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
    }

    .title {
        font-family: 'Comic Neue', cursive;
        font-size: 3.2rem;
        font-weight: 700;
        background: linear-gradient(90deg, #4CAF9C, #81D4FA);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    .tagline {
        font-size: 1.3rem;
        color: #4CAF9C;
        font-weight: 300;
    }

    .metric-card {
        background: white;
        border-radius: 25px;
        padding: 1.5rem;
        box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        border: 3px solid var(--mint);
    }

    .metric-card:hover {
        transform: scale(1.05) translateY(-10px);
        border-color: #FFCCBC;
    }

    .leaf {
        position: absolute;
        font-size: 1.8rem;
        animation: leaf-fall 8s linear infinite;
        opacity: 0.6;
    }

    @keyframes leaf-fall {
        0% { transform: translateY(-100px) rotate(0deg); }
        100% { transform: translateY(600px) rotate(360deg); }
    }
</style>
"""

st.markdown(custom_css, unsafe_allow_html=True)

# Floating leaves background
leaves = """
<div style="position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; overflow:hidden;">
    <div class="leaf" style="left:10%; animation-delay:0s;">🍃</div>
    <div class="leaf" style="left:25%; animation-delay:2s;">🌿</div>
    <div class="leaf" style="left:45%; animation-delay:1.5s;">🍃</div>
    <div class="leaf" style="left:70%; animation-delay:4s;">🌱</div>
    <div class="leaf" style="left:85%; animation-delay:0.8s;">🍃</div>
</div>
"""
html(leaves)

# Header
st.markdown('''
<div class="header">
    <div class="vayundhra">🫧</div>
    <h1 class="title">CO<sub>2</sub></h1>
    <p class="tagline">vayundhra is feeling <span style="color:#4CAF9C; font-weight:700;">happy today</span> 🌍</p>
</div>
''', unsafe_allow_html=True)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
html, body, [class*="css"] { font-family: 'DM Sans', sans-serif; }
h1, h2, h3 { font-family: 'Syne', sans-serif !important; }
.stApp { background: #0a0e0b; color: #e8f0e9; }
section[data-testid="stSidebar"] { background: #111712 !important; border-right: 1px solid #1f2d20; }
[data-testid="stMetric"] { background: #161d17; border: 1px solid #1f2d20; border-radius: 14px; padding: 1rem 1.25rem; }
[data-testid="stMetricLabel"] { color: #6b7c6d !important; font-size: 0.75rem !important; text-transform: uppercase; letter-spacing: 0.08em; }
[data-testid="stMetricValue"] { color: #4ade80 !important; font-family: 'Syne', sans-serif !important; font-size: 1.5rem !important; }
input, select, textarea { background: #161d17 !important; border: 1px solid #1f2d20 !important; color: #e8f0e9 !important; border-radius: 10px !important; }
.stButton > button { background: #4ade80 !important; color: #0a0e0b !important; border: none !important; border-radius: 10px !important; font-weight: 700 !important; font-family: 'Syne', sans-serif !important; padding: 0.75rem 2.5rem !important; min-width: 220px !important; font-size: 0.95rem !important; }
.stButton > button:hover { opacity: 0.85 !important; }
.stTabs [data-baseweb="tab-list"] { background: #111712; border-radius: 12px; padding: 6px; gap: 6px; }
.stTabs [data-baseweb="tab"] { background: transparent; color: #6b7c6d; border-radius: 8px; padding: 0.6rem 1.8rem !important; font-size: 0.9rem !important; }
.stTabs [aria-selected="true"] { background: rgba(74,222,128,0.12) !important; color: #4ade80 !important; }
.stSuccess { background: rgba(74,222,128,0.08) !important; border: 1px solid rgba(74,222,128,0.3) !important; color: #4ade80 !important; border-radius: 10px !important; }
.stInfo    { background: rgba(96,165,250,0.08) !important; border: 1px solid rgba(96,165,250,0.3) !important; color: #60a5fa !important; border-radius: 10px !important; }
.stWarning { background: rgba(251,191,36,0.08) !important; border: 1px solid rgba(251,191,36,0.3)  !important; color: #fbbf24 !important; border-radius: 10px !important; }
.stError   { background: rgba(248,113,113,0.08) !important; border: 1px solid rgba(248,113,113,0.3) !important; color: #f87171 !important; border-radius: 10px !important; }
</style>
""", unsafe_allow_html=True)

# ── Groq ───────────────────────────────────────────────────────────────────
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def ask_ai(prompt):
    try:
        chat = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant", temperature=0.6, max_tokens=400
        )
        return chat.choices[0].message.content
    except Exception as e:
        return f"AI Error: {e}"

# ── Backend ────────────────────────────────────────────────────────────────
BACKEND = "http://localhost:5000"

def backend_predict(units, distance, cylinders, transport):
    try:
        r = req.post(f"{BACKEND}/predict", json={"units": units, "distance": distance, "cylinders": cylinders, "transport": transport}, timeout=5)
        r.raise_for_status(); return r.json(), None
    except req.exceptions.ConnectionError:
        return None, "Cannot connect to backend. Run: python run.py"
    except Exception as e:
        return None, f"Backend error: {e}"

def backend_cluster(units, distance, cylinders, total_co2):
    try:
        r = req.post(f"{BACKEND}/cluster", json={"units": units, "distance": distance, "cylinders": cylinders, "total_co2": total_co2}, timeout=5)
        r.raise_for_status(); return r.json(), None
    except req.exceptions.ConnectionError:
        return None, "Cannot connect to backend."
    except Exception as e:
        return None, f"Backend error: {e}"

# ══════════════════════════════════════════════════════════════════════════
#  INDIA DATA
# ══════════════════════════════════════════════════════════════════════════

STATE_GRID_FACTORS = {
    "Andhra Pradesh":0.79,"Arunachal Pradesh":0.18,"Assam":0.62,"Bihar":0.95,
    "Chhattisgarh":1.02,"Goa":0.71,"Gujarat":0.88,"Haryana":0.91,
    "Himachal Pradesh":0.09,"Jharkhand":1.05,"Karnataka":0.58,"Kerala":0.41,
    "Madhya Pradesh":0.97,"Maharashtra":0.82,"Manipur":0.21,"Meghalaya":0.34,
    "Mizoram":0.19,"Nagaland":0.22,"Odisha":0.99,"Punjab":0.76,"Rajasthan":0.89,
    "Sikkim":0.14,"Tamil Nadu":0.71,"Telangana":0.85,"Tripura":0.55,
    "Uttar Pradesh":0.94,"Uttarakhand":0.17,"West Bengal":0.98,
    "Delhi":0.83,"Chandigarh":0.74,
}

STATE_PERCAPITA_CO2 = {
    "Jharkhand":4.8,"Chhattisgarh":4.5,"Odisha":4.1,"Madhya Pradesh":3.8,
    "Uttar Pradesh":3.4,"Bihar":3.1,"Rajasthan":3.0,"Haryana":2.9,
    "Gujarat":2.8,"Maharashtra":2.6,"Telangana":2.5,"Andhra Pradesh":2.3,
    "West Bengal":2.2,"Karnataka":1.9,"Tamil Nadu":1.8,"Punjab":1.7,
    "Delhi":1.6,"Assam":1.4,"Kerala":1.2,"Himachal Pradesh":0.9,
    "Uttarakhand":0.8,"Sikkim":0.5,"Goa":1.1,"Manipur":0.6,
}

METHANE_LANDFILLS = {
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
}

CITY_AQI = {
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
}

STATE_POLICIES = {
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
}

INDIA_NATIONAL = {
    "total_co2_gt":3.9,"rank_global":3,"percapita_tonnes":1.9,
    "renewable_pct":43,"coal_pct":51,"forest_cover_pct":21.7,
    "ev_sales_2024":1680000,"solar_gw":82,"wind_gw":47,
    "ndc_target":"45% emissions intensity reduction by 2030 vs 2005",
    "net_zero_target":2070,
}

AQI_COLORS = {
    "Good":"#4ade80","Satisfactory":"#86efac","Moderate":"#fbbf24",
    "Poor":"#f97316","Very Poor":"#f87171","Severe":"#dc2626",
}

# ── Session state ──────────────────────────────────────────────────────────
for k, v in [
    ("username",None),("results",None),("chat_log",[]),
    ("inp_state","Tamil Nadu"),("inp_units",0.0),("inp_distance",0.0),
    ("inp_cylinders",0),("inp_transport","Car"),("inp_vehicle","Petrol"),
]:
    if k not in st.session_state: st.session_state[k] = v

# ── Sidebar ────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## CarbonIQ India")
    st.markdown("*AI Emission Intelligence*")
    st.markdown("---")
    mode = st.radio("Select Mode", [
        "Individual Mode", "India Methane Tracker",
        "City Air Quality", "State Policy Hub", "Organization Dashboard"
    ])
    if st.session_state.username:
        st.markdown(f"**User:** {st.session_state.username}")
        if st.button("Logout"):
            st.session_state.username = None
            st.session_state.results  = None
            st.session_state.chat_log = []
            st.rerun()
    st.markdown("---")
    st.markdown("<div style='font-size:0.75rem;color:#6b7c6d'>Data: CPCB · CEA · MoEFCC · GHGSat · Carbon Mapper · NITI Aayog 2024-25</div>", unsafe_allow_html=True)

# ── Login ──────────────────────────────────────────────────────────────────
if st.session_state.username is None:
    st.markdown("<br><br>", unsafe_allow_html=True)
    col = st.columns([1,2,1])[1]
    with col:
        st.markdown("## Welcome to CarbonIQ India")
        st.markdown("*India's AI-powered carbon emission intelligence platform*")
        st.markdown("<br>", unsafe_allow_html=True)
        name = st.text_input("Enter your name to begin")
        if st.button("Get Started"):
            if name.strip():
                st.session_state.username = name.strip()
                st.rerun()
            else:
                st.warning("Please enter a valid name.")
    st.stop()


# ══════════════════════════════════════════════════════════════════════════
#  INDIVIDUAL MODE
# ══════════════════════════════════════════════════════════════════════════
if mode == "Individual Mode":
    st.markdown("## CarbonIQ — Personal Emission Analysis")
    st.markdown(f"*Hello, **{st.session_state.username}** — track, predict & reduce your carbon footprint*")
    st.markdown("---")

    # Collapse expander after analysis so results are visible
    expand_inputs = not bool(st.session_state.results)

    with st.expander("Enter Your Usage Data", expanded=expand_inputs):
        c1, c2 = st.columns(2)
        with c1:
            state_sel = st.selectbox(
                "Your State", list(STATE_GRID_FACTORS.keys()),
                index=list(STATE_GRID_FACTORS.keys()).index(st.session_state.inp_state),
                key="inp_state"
            )
            units = st.number_input(
                "Electricity (kWh / month)", min_value=0.0, step=10.0,
                value=st.session_state.inp_units, key="inp_units"
            )
            transport_mode = st.selectbox(
                "Transport Mode", ["Car","Bike","Bus","Metro","Walk/Cycle"],
                index=["Car","Bike","Bus","Metro","Walk/Cycle"].index(st.session_state.inp_transport),
                key="inp_transport"
            )
        with c2:
            distance = st.number_input(
                "Travel Distance (km / week)", min_value=0.0, step=5.0,
                value=st.session_state.inp_distance, key="inp_distance"
            )
            cylinders = st.number_input(
                "LPG Cylinders per month", min_value=0, step=1,
                value=st.session_state.inp_cylinders, key="inp_cylinders"
            )
            vehicle_type = st.selectbox(
                "Vehicle Type", ["Petrol","Diesel","CNG","Electric","N/A"],
                index=["Petrol","Diesel","CNG","Electric","N/A"].index(st.session_state.inp_vehicle),
                key="inp_vehicle"
            )
        analyze = st.button("Analyze Carbon Footprint")

    state_ef = STATE_GRID_FACTORS.get(state_sel, 0.82)
    TF = {
        "Car":       {"Petrol":0.21,"Diesel":0.27,"CNG":0.16,"Electric":0.06,"N/A":0.21},
        "Bike":      {"Petrol":0.09,"Diesel":0.10,"CNG":0.07,"Electric":0.03,"N/A":0.09},
        "Bus":       {"Petrol":0.05,"Diesel":0.06,"CNG":0.04,"Electric":0.02,"N/A":0.05},
        "Metro":     {"Petrol":0.03,"Diesel":0.03,"CNG":0.03,"Electric":0.03,"N/A":0.03},
        "Walk/Cycle":{"Petrol":0.0, "Diesel":0.0, "CNG":0.0, "Electric":0.0, "N/A":0.0},
    }

    if analyze:
        t_factor = TF[transport_mode][vehicle_type]
        with st.spinner("Calling backend..."):
            pred, err = backend_predict(units, distance, cylinders, transport_mode)
        if err:
            st.error(err)
        else:
            elec_co2  = round(units * state_ef, 2)
            trans_co2 = round(distance * t_factor, 2)
            lpg_co2   = round(cylinders * 14.2 * 2.98, 2)
            total_co2 = round(elec_co2 + trans_co2 + lpg_co2, 2)
            clust, err2 = backend_cluster(units, distance, cylinders, total_co2)
            if err2:
                st.error(err2)
            else:
                st.session_state.results = {
                    "electricity":elec_co2,"transport":trans_co2,"lpg":lpg_co2,
                    "total":total_co2,"predicted":pred["predicted_co2"],
                    "risk":pred["risk_score"],"profile":clust["cluster_label"],
                    "state":state_sel,"state_ef":state_ef,
                    "units":units,"distance":distance,"cylinders":cylinders,
                    "transport_mode":transport_mode,"vehicle_type":vehicle_type,
                }

    tab1, tab2, tab3, tab4 = st.tabs(["Dashboard","Forecast","Optimization","AI Advisor"])

    with tab1:
        if not st.session_state.results:
            st.info("Enter your usage data above and click Analyze Carbon Footprint.")
        else:
            r = st.session_state.results
            nat_avg = (INDIA_NATIONAL["percapita_tonnes"] * 1000) / 12
            if r["risk"] < 33:   rl, rd = "Low Risk",      "normal"
            elif r["risk"] < 66: rl, rd = "Moderate Risk", "off"
            else:                rl, rd = "High Risk",      "inverse"

            st.success(f"Emission Profile: {r['profile']}  |  State: {r['state']}  |  Grid Factor: {r['state_ef']} kg CO2/kWh")
            m1,m2,m3,m4,m5 = st.columns(5)
            m1.metric("Total CO2",       f"{r['total']:.1f} kg")
            m2.metric("Predicted CO2",   f"{r['predicted']:.1f} kg")
            m3.metric("Risk Score",      f"{r['risk']:.0f}/100", delta=rl, delta_color=rd)
            m4.metric("vs National Avg", f"{r['total']-nat_avg:+.1f} kg", delta=f"Avg: {nat_avg:.0f} kg/mo")
            m5.metric("State Grid EF",   f"{r['state_ef']} kg/kWh")
            st.markdown("---")
            c1, c2 = st.columns(2)
            with c1:
                st.markdown("**Breakdown by source**")
                bdf = pd.DataFrame({"Source":["Electricity","Transport","LPG"],
                                    "CO2 (kg)":[r["electricity"],r["transport"],r["lpg"]]})
                st.bar_chart(bdf.set_index("Source"))
            with c2:
                st.markdown("**Source share**")
                total = r["total"] if r["total"] > 0 else 1
                for src, val in zip(["Electricity","Transport","LPG"],
                                    [r["electricity"],r["transport"],r["lpg"]]):
                    st.progress(int(val/total*100), text=f"{src}: {val:.1f} kg ({val/total*100:.0f}%)")
                st.markdown("---")
                state_monthly = (STATE_PERCAPITA_CO2.get(r["state"],2.0)*1000)/12
                st.metric("Your state avg", f"{state_monthly:.0f} kg/mo",
                          delta=f"You: {r['total']:.1f} kg")

    with tab2:
        if not st.session_state.results:
            st.info("Run an analysis first.")
        else:
            r = st.session_state.results
            st.markdown("**6-Month CO2 Forecast**")
            months = ["Now","Month 1","Month 2","Month 3","Month 4","Month 5","Month 6"]
            proj   = [r["total"]*f for f in [1,1.05,0.97,1.02,0.94,0.90,0.87]]
            target = [r["total"]*f for f in [1,0.95,0.90,0.85,0.80,0.75,0.70]]
            st.line_chart(pd.DataFrame({"Projected (kg)":[round(v,1) for v in proj],
                                         "Target (kg)":[round(v,1) for v in target]}, index=months))
            st.caption("Target assumes 5% monthly reduction effort. Projected assumes current behaviour.")

    with tab3:
        if not st.session_state.results:
            st.info("Run an analysis first.")
        else:
            r = st.session_state.results
            st.markdown("**Personalized Reduction Tips**")
            tips = []
            if r["electricity"] >= r["transport"] and r["electricity"] >= r["lpg"]:
                if r["state_ef"] > 0.8:
                    tips.append(("Electricity — High Grid Factor State",
                                 f"Your state ({r['state']}) grid factor is {r['state_ef']} kg/kWh — above national avg of 0.82. "
                                 f"MNRE offers 40% subsidy on rooftop solar. Could save ~{r['electricity']*0.35:.1f} kg/month.",
                                 r["electricity"]*0.35))
                else:
                    tips.append(("Electricity — Cleaner Grid, Focus on Efficiency",
                                 f"Your state has a clean grid ({r['state_ef']} kg/kWh). Switch to 5-star rated appliances and LED lighting.",
                                 r["electricity"]*0.20))
            if r["transport"] > 0 and r["vehicle_type"] in ["Petrol","Diesel"]:
                tips.append(("Transport — Switch to CNG or EV",
                             f"CNG cuts transport CO2 by ~25%. EVs by up to 70% on your state grid. "
                             f"FAME-II subsidy: up to Rs 15,000 on 2-wheelers.",
                             r["transport"]*0.5))
            elif r["transport"] > 0 and r["transport_mode"] == "Car":
                tips.append(("Transport — Carpooling and Metro",
                             "Sharing rides 3 days/week halves your transport footprint. Metro is 10x less polluting than a solo petrol car.",
                             r["transport"]*0.4))
            tips.append(("LPG — Switch to PNG or Induction Cooking",
                         f"PNG emits ~20% less than LPG. Induction on a clean grid saves ~{r['lpg']*0.6:.1f} kg/month. "
                         f"PM Ujjwala Yojana provides subsidised clean cooking connections.",
                         r["lpg"]*0.5))
            tips.append(("Carbon Offsetting — Green India Mission",
                         "India's Green India Mission targets 2.5 crore hectares of new forest. "
                         "Offset 1 tonne CO2 for ~Rs 500-1500 via MCX verified carbon credits.", 0))

            total_save = sum(t[2] for t in tips)
            st.success(f"Potential saving: {total_save:.1f} kg CO2/month with all steps applied")
            for title, detail, saving in tips:
                with st.expander(title):
                    st.write(detail)
                    if saving > 0:
                        st.metric("Potential saving", f"{saving:.1f} kg CO2/month")

    with tab4:
        st.markdown("**AI Emission Advisor**")
        st.caption("Powered by Groq + LLaMA 3.1")
        qcols = st.columns(3)
        prompts = [
            "How does India's coal dependency affect my electricity carbon footprint?",
            "What Indian government subsidies exist for solar panels or EVs in 2024?",
            "Explain the methane crisis at Secunderabad and Deonar landfills."
        ]
        for i,(col,prompt) in enumerate(zip(qcols,prompts)):
            with col:
                if st.button(prompt[:38]+"...", key=f"qp{i}"):
                    st.session_state.chat_log.append({"role":"user","content":prompt})
                    st.session_state.chat_log.append({"role":"assistant","content":ask_ai(prompt)})

        for msg in st.session_state.chat_log:
            with st.chat_message(msg["role"]): st.write(msg["content"])

        if user_msg := st.chat_input("Ask about emissions, policies, air quality..."):
            ctx = ""
            if st.session_state.results:
                r = st.session_state.results
                ctx = (f"User is from {r['state']}, India. Monthly CO2: {r['total']:.1f}kg. "
                       f"Profile: {r['profile']}. State grid factor: {r['state_ef']} kg/kWh. ")
            full = ctx + "Question: " + user_msg + " Give a concise India-specific answer in 3 sentences."
            st.session_state.chat_log.append({"role":"user","content":user_msg})
            with st.chat_message("user"): st.write(user_msg)
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    reply = ask_ai(full)
                st.write(reply)
            st.session_state.chat_log.append({"role":"assistant","content":reply})


# ══════════════════════════════════════════════════════════════════════════
#  INDIA METHANE TRACKER
# ══════════════════════════════════════════════════════════════════════════
elif mode == "India Methane Tracker":
    st.markdown("## India Methane Landfill Tracker")
    st.markdown("*Satellite-verified methane emissions — GHGSat / Carbon Mapper 2024-25*")
    st.markdown("---")

    total_ch4 = sum(v["ch4_kt"] for v in METHANE_LANDFILLS.values())
    m1,m2,m3,m4 = st.columns(4)
    m1.metric("Tracked Sites",       len(METHANE_LANDFILLS))
    m2.metric("Total CH4",           f"{total_ch4:.0f} kt/year")
    m3.metric("CO2 Equivalent",      f"{total_ch4*28:.0f} kt CO2e")
    m4.metric("Worst Global Rank",   "#3 — Secunderabad")

    st.warning("Methane (CH4) is 28x more potent than CO2 over 100 years. "
               "Satellite data released in 2025 places Secunderabad and Mumbai among the world's biggest landfill methane sources.")
    st.markdown("---")

    for site, d in METHANE_LANDFILLS.items():
        with st.expander(f"{site}  |  {d['ch4_kt']} kt CH4/year  |  Global Rank #{d['rank_global']}"):
            c1,c2,c3,c4 = st.columns(4)
            c1.metric("CH4 Emissions",  f"{d['ch4_kt']} kt/year")
            c2.metric("CO2 Equivalent", f"{d['ch4_kt']*28:.0f} kt")
            c3.metric("Area",           f"{d['area_ha']} ha")
            c4.metric("Daily Waste",    f"{d['waste_daily_tonnes']:,} t/day")
            st.info(d["note"])
            st.caption(f"Active since: {d['active_since']}  |  Source: {d['source']}")
            st.progress(int((d["ch4_kt"]/total_ch4)*100),
                        text=f"{(d['ch4_kt']/total_ch4)*100:.1f}% of tracked India landfill methane")

    st.markdown("---")
    st.markdown("**Comparative CH4 emissions**")
    mdf = pd.DataFrame({
        "Site": list(METHANE_LANDFILLS.keys()),
        "CH4 (kt/year)": [v["ch4_kt"] for v in METHANE_LANDFILLS.values()],
    })
    st.bar_chart(mdf.set_index("Site"))

    st.markdown("---")
    c1,c2,c3 = st.columns(3)
    with c1:
        st.markdown("**Landfill Gas Capture**")
        st.write("CH4 from landfills can be captured and converted to electricity. "
                 "Deonar alone could power ~50,000 homes if fully harnessed.")
    with c2:
        st.markdown("**Waste Segregation**")
        st.write("Wet waste composting reduces methane by up to 70%. "
                 "Swachh Bharat Mission Phase 2 mandates 100% source segregation.")
    with c3:
        st.markdown("**Bio-mining**")
        st.write("Legacy waste bio-mining recovers land while reducing long-term methane. "
                 "Ongoing at Ghazipur. Cost: Rs 400-600 per tonne.")


# ══════════════════════════════════════════════════════════════════════════
#  CITY AIR QUALITY
# ══════════════════════════════════════════════════════════════════════════
elif mode == "City Air Quality":
    st.markdown("## India City Air Quality Index")
    st.markdown("*CPCB average AQI — 20 major cities, 2024-25*")
    st.markdown("---")

    aqi_vals = [v["aqi"] for v in CITY_AQI.values()]
    m1,m2,m3,m4 = st.columns(4)
    m1.metric("Cities Tracked",  len(CITY_AQI))
    m2.metric("Worst AQI",       f"{max(aqi_vals)} — Delhi")
    m3.metric("Best AQI",        f"{min(aqi_vals)} — Kochi")
    m4.metric("National Avg",    f"{sum(aqi_vals)//len(aqi_vals)}")
    st.markdown("---")

    sel = st.selectbox("Select a city", list(CITY_AQI.keys()))
    cd  = CITY_AQI[sel]
    col = AQI_COLORS.get(cd["category"],"#6b7c6d")
    st.markdown(
        f"<div style='background:#161d17;border:1px solid #1f2d20;border-radius:14px;padding:1.25rem;margin-bottom:1rem'>"
        f"<div style='font-size:0.75rem;color:#6b7c6d;text-transform:uppercase;letter-spacing:0.08em'>AQI Category</div>"
        f"<div style='font-size:2rem;font-weight:700;color:{col};font-family:Syne,sans-serif'>{cd['category']}</div>"
        f"<div style='font-size:1rem;color:#a3b5a5'>AQI: {cd['aqi']}</div></div>",
        unsafe_allow_html=True
    )
    c1,c2,c3,c4 = st.columns(4)
    c1.metric("PM2.5", f"{cd['pm25']} µg/m³", delta="Safe: <25")
    c2.metric("PM10",  f"{cd['pm10']} µg/m³",  delta="Safe: <50")
    c3.metric("NO2",   f"{cd['no2']} µg/m³",   delta="Safe: <40")
    c4.metric("SO2",   f"{cd['so2']} µg/m³",   delta="Safe: <20")
    st.markdown("---")
    st.markdown("**All cities — AQI ranking**")
    adf = pd.DataFrame({"City":list(CITY_AQI.keys()),"AQI":[v["aqi"] for v in CITY_AQI.values()]}).sort_values("AQI",ascending=False)
    st.bar_chart(adf.set_index("City"))
    st.markdown("---")
    st.markdown("**CPCB AQI categories**")
    st.dataframe(pd.DataFrame({
        "Category":["Good","Satisfactory","Moderate","Poor","Very Poor","Severe"],
        "AQI Range":["0-50","51-100","101-200","201-300","301-400","401+"],
        "Health Impact":["Minimal","Minor breathing discomfort for sensitive people",
                         "Breathing discomfort for asthma patients",
                         "Breathing discomfort on prolonged exposure",
                         "Respiratory illness on prolonged exposure",
                         "Serious for healthy people, hazardous for sensitive groups"]
    }), use_container_width=True, hide_index=True)


# ══════════════════════════════════════════════════════════════════════════
#  STATE POLICY HUB
# ══════════════════════════════════════════════════════════════════════════
elif mode == "State Policy Hub":
    st.markdown("## India State Green Policy Hub")
    st.markdown("*Renewable energy share, EV policy, and climate targets — MoEFCC / NITI Aayog 2024*")
    st.markdown("---")

    avg_ren   = sum(v["ren_pct"] for v in STATE_POLICIES.values()) / len(STATE_POLICIES)
    ev_states = sum(1 for v in STATE_POLICIES.values() if v["ev_policy"]=="Yes")
    m1,m2,m3,m4 = st.columns(4)
    m1.metric("States Tracked",        len(STATE_POLICIES))
    m2.metric("Avg Renewable Share",   f"{avg_ren:.0f}%")
    m3.metric("States with EV Policy", f"{ev_states} / {len(STATE_POLICIES)}")
    m4.metric("India NDC Target",      "45% intensity cut by 2030")
    st.markdown("---")

    sel_s = st.selectbox("Select a state", list(STATE_POLICIES.keys()))
    sp    = STATE_POLICIES[sel_s]
    gef   = STATE_GRID_FACTORS.get(sel_s, 0.82)
    pc    = STATE_PERCAPITA_CO2.get(sel_s, 2.0)

    rc = {"A+":"#4ade80","A":"#86efac","B+":"#bef264","B":"#fbbf24","B-":"#f97316",
          "C+":"#fb923c","C":"#f87171","C-":"#ef4444","D+":"#dc2626","D":"#991b1b"}
    rcol = rc.get(sp["green_rating"],"#6b7c6d")
    st.markdown(
        f"<div style='background:#161d17;border:1px solid #1f2d20;border-radius:14px;padding:1.25rem;margin-bottom:1rem'>"
        f"<div style='font-size:0.75rem;color:#6b7c6d;text-transform:uppercase;letter-spacing:0.08em'>Green Rating</div>"
        f"<div style='font-size:2.5rem;font-weight:700;color:{rcol};font-family:Syne,sans-serif'>{sp['green_rating']}</div>"
        f"</div>", unsafe_allow_html=True
    )
    c1,c2,c3,c4,c5 = st.columns(5)
    c1.metric("Renewable Share",  f"{sp['ren_pct']}%")
    c2.metric("EV Policy",        sp["ev_policy"])
    c3.metric("Net Zero Target",  str(sp["target_year"]))
    c4.metric("Grid Factor",      f"{gef} kg/kWh")
    c5.metric("Per-capita CO2",   f"{pc} t/year")
    st.markdown("---")
    st.markdown("**Key Policy**")
    st.info(sp["key_policy"])

    if sp["ren_pct"] < 20:
        st.error(f"{sel_s} has low renewable penetration ({sp['ren_pct']}%). "
                 f"Grid factor {gef} kg/kWh is above national average. Urgent: coal transition needed.")
    elif sp["ren_pct"] > 60:
        st.success(f"{sel_s} is a green energy leader at {sp['ren_pct']}% renewable. "
                   f"Grid factor {gef} kg/kWh is among India's lowest.")

    st.markdown("---")
    st.markdown("**All states — Renewable energy share**")
    pdf = pd.DataFrame({
        "State":list(STATE_POLICIES.keys()),
        "Renewable %":[v["ren_pct"] for v in STATE_POLICIES.values()],
    }).sort_values("Renewable %",ascending=False)
    st.bar_chart(pdf.set_index("State"))
    st.markdown("---")
    st.markdown("**Full comparison table**")
    st.dataframe(pd.DataFrame([{
        "State":s,"Renewable %":v["ren_pct"],
        "Grid Factor":STATE_GRID_FACTORS.get(s,0.82),
        "Per-capita CO2 (t)":STATE_PERCAPITA_CO2.get(s,"-"),
        "EV Policy":v["ev_policy"],"Net Zero":v["target_year"],"Green Rating":v["green_rating"],
    } for s,v in STATE_POLICIES.items()]).sort_values("Renewable %",ascending=False),
    use_container_width=True, hide_index=True)


# ══════════════════════════════════════════════════════════════════════════
#  ORGANIZATION DASHBOARD
# ══════════════════════════════════════════════════════════════════════════
elif mode == "Organization Dashboard":
    st.markdown("## CarbonIQ — Enterprise Portal")
    st.markdown("*Organization-wide emission analytics*")
    st.markdown("---")

    if os.path.exists("carbon_data.csv"):
        data = pd.read_csv("carbon_data.csv", on_bad_lines="skip")
        m1,m2,m3,m4 = st.columns(4)
        m1.metric("Total Records", len(data))
        m2.metric("Average CO2",   f"{data['Total_CO2'].mean():.1f} kg")
        m3.metric("Highest CO2",   f"{data['Total_CO2'].max():.1f} kg")
        m4.metric("Lowest CO2",    f"{data['Total_CO2'].min():.1f} kg")
        st.markdown("---")
        c1,c2 = st.columns(2)
        with c1:
            st.markdown("**Total CO2 Trend**"); st.line_chart(data["Total_CO2"])
        with c2:
            st.markdown("**Distribution**"); st.bar_chart(data["Total_CO2"].value_counts().sort_index())
        st.markdown("**Raw Data**"); st.dataframe(data, use_container_width=True)
    else:
        st.warning("carbon_data.csv not found in project directory.")

    st.markdown("---")
    st.markdown("**India National Stats (MoEFCC 2023-24)**")
    n = INDIA_NATIONAL
    c1,c2,c3,c4 = st.columns(4)
    c1.metric("Total CO2",        f"{n['total_co2_gt']} Gt/year")
    c2.metric("Global Rank",       f"#{n['rank_global']}")
    c3.metric("Per-capita",        f"{n['percapita_tonnes']} t/year")
    c4.metric("Renewable Cap",     f"{n['renewable_pct']}%")
    c5,c6,c7,c8 = st.columns(4)
    c5.metric("Solar Installed",   f"{n['solar_gw']} GW")
    c6.metric("Wind Installed",    f"{n['wind_gw']} GW")
    c7.metric("EV Sales FY2024",   f"{n['ev_sales_2024']:,}")
    c8.metric("Net Zero Target",   str(n['net_zero_target']))
    st.info(f"India NDC: {n['ndc_target']}")