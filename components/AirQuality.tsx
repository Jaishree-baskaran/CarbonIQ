import { useState, useEffect } from "react";
import { CITY_AQI, AQI_COLORS } from "@/utils/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { CloudFog, Building2, Search, Palette } from "lucide-react";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AirQuality() {
  const [selCity, setSelCity] = useState(Object.keys(CITY_AQI)[0]);
  
  const [globalData, setGlobalData] = useState<any[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    async function fetchGlobal() {
      try {
        // As requested: 5 key cities only for the top cards.
        const topCities = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore"];
        const promises = topCities.map(city => fetch(`/api/aqi?city=${city}&t=${Date.now()}`).then(r => r.json()));
        const results = await Promise.all(promises);
        
        const validData = results
          .map((r, i) => r.success && r.data ? { city: topCities[i], ...r.data } : null)
          .filter(Boolean);
          
        setGlobalData(validData);
      } catch (err) {
        console.error("Failed to fetch global data", err);
      } finally {
        setLoadingGlobal(false);
      }
    }
    
    fetchGlobal(); // Initial fetch
    // Connect to everyday live updates by polling every 60 seconds
    intervalId = setInterval(fetchGlobal, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const { data: response, isValidating } = useSWR(`/api/aqi?city=${encodeURIComponent(selCity)}`, fetcher);
  const liveData = response?.data;

  const liveAqis = globalData.map((d: any) => d.aqi);
  const hasLive = liveAqis.length > 0;

  const maxAqi = hasLive ? Math.max(...liveAqis) : 0;
  const minAqi = hasLive ? Math.min(...liveAqis) : 0;
  const avgAqi = hasLive 
    ? Math.round(liveAqis.reduce((a, b) => a + b, 0) / liveAqis.length)
    : 0;

  const worstCity = hasLive ? globalData.find((d: any) => d.aqi === maxAqi)?.city : "";
  const worstCat = hasLive ? globalData.find((d: any) => d.aqi === maxAqi)?.category : "";

  const bestCity = hasLive ? globalData.find((d: any) => d.aqi === minAqi)?.city : "";
  const bestCat = hasLive ? globalData.find((d: any) => d.aqi === minAqi)?.category : "";

  const cd = liveData || CITY_AQI[selCity];
  const col = AQI_COLORS[cd.category] || "#6b7c6d";

  const chartData = Object.entries(CITY_AQI)
    .map(([city, data]: [string, any]) => ({ city, aqi: data.aqi }))
    .sort((a, b) => b.aqi - a.aqi);

  const formatVal = (val: any) => typeof val === 'number' ? `${val} µg/m³` : (val?.includes('µg') ? val : `${val} µg/m³`);

  return (
    <div className="w-full">


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="metric-card after:bg-blue after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Cities Tracked</div>
          {loadingGlobal ? (
             <div className="font-bold text-black/50 text-[11px] animate-pulse py-2">Fetching Live Data...</div>
          ) : (
             <div className="font-fredoka text-[28px] text-[#0077aa] leading-none">{globalData.length}</div>
          )}
        </div>
        <div className="metric-card after:bg-pink after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Worst AQI</div>
          {loadingGlobal ? (
             <div className="font-bold text-black/50 text-[11px] animate-pulse py-2">Fetching Live Data...</div>
          ) : (
             <>
               <div className="font-fredoka text-[28px] text-pink leading-none">{maxAqi}</div>
               <div className="text-[10px] font-bold text-black/40 mt-1">{worstCity} · {worstCat}</div>
             </>
          )}
        </div>
        <div className="metric-card after:bg-lime after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Best AQI</div>
          {loadingGlobal ? (
             <div className="font-bold text-black/50 text-[11px] animate-pulse py-2">Fetching Live Data...</div>
          ) : (
             <>
               <div className="font-fredoka text-[28px] text-[#5a8a00] leading-none">{minAqi}</div>
               <div className="text-[10px] font-bold text-black/40 mt-1">{bestCity} · {bestCat}</div>
             </>
          )}
        </div>
        <div className="metric-card after:bg-orange after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">National Avg</div>
          {loadingGlobal ? (
             <div className="font-bold text-black/50 text-[11px] animate-pulse py-2">Fetching Live Data...</div>
          ) : (
             <div className="font-fredoka text-[28px] text-orange leading-none">{avgAqi}</div>
          )}
        </div>
      </div>

      <div className="neo-card mb-5 relative overflow-hidden">
        <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
          <Search size={20} strokeWidth={2.5} className="text-black" /> City AQI Explorer
        </div>
        <select 
          className="neo-input mb-[16px] max-w-md relative z-10"
          value={selCity} 
          onChange={e => setSelCity(e.target.value)}
        >
          {Object.keys(CITY_AQI).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        {isValidating ? (
          <div className="animate-pulse">
            <div className="flex items-center gap-[16px] mb-[16px]">
              <div className="w-[80px] h-[56px] bg-black/10 rounded-[8px]"></div>
              <div>
                <div className="w-[100px] h-[24px] bg-black/10 rounded-[20px] mb-1"></div>
                <div className="w-[80px] h-[12px] bg-black/5 rounded-[4px]"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="metric-card !p-3">
                  <div className="w-[40px] h-[10px] bg-black/10 mb-2 rounded"></div>
                  <div className="w-[60px] h-[20px] bg-black/10 mb-2 rounded"></div>
                  <div className="w-[50px] h-[10px] bg-black/5 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="flex items-center gap-[16px] mb-[16px]">
              <div className="font-fredoka text-[56px] leading-none" style={{ color: col }}>{cd.aqi}</div>
              <div>
                <div className="inline-block p-[4px_12px] rounded-[20px] text-[11px] font-black border-[2.5px] border-black" style={{ backgroundColor: col, color: ['#fbbf24', '#86efac', '#4ade80'].includes(col) ? '#111' : '#fff' }}>
                  {cd.category}
                </div>
                <div className="text-[11px] font-bold text-black/40 mt-[4px]">Air Quality Index</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "PM2.5", val: formatVal(cd.pm25), delta: "Safe: <25" },
                { label: "PM10", val: formatVal(cd.pm10), delta: "Safe: <50" },
                { label: "NO2", val: formatVal(cd.no2), delta: "Safe: <40" },
                { label: "SO2", val: formatVal(cd.so2), delta: "Safe: <20" }
              ].map((m, i) => (
                <div key={i} className="metric-card !p-3">
                  <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">{m.label}</div>
                  <div className="font-fredoka text-[20px] text-black leading-none">{m.val}</div>
                  <div className="text-[10px] font-bold text-black/40 mt-1">{m.delta}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="neo-card">
        <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
          <Palette size={20} strokeWidth={2.5} className="text-black" /> AQI Scale
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[10px]">
          {[
            { cat: "Good · 0–50", desc: "Minimal health impact", color: "#4ade80", text: "#155724" },
            { cat: "Satisfactory · 51–100", desc: "Minor issues for sensitive", color: "#86efac", text: "#1a6830" },
            { cat: "Moderate · 101–200", desc: "Asthma patients affected", color: "#fbbf24", text: "#856404" },
            { cat: "Poor · 201–300", desc: "Breathing discomfort", color: "#f97316", text: "#7c3a00" },
            { cat: "Very Poor · 301–400", desc: "Respiratory illness risk", color: "#f87171", text: "#721c24" },
            { cat: "Severe · 401+", desc: "Hazardous for all", color: "#dc2626", text: "#450a0a" }
          ].map((m, i) => (
            <div key={i} className="border-[2.5px] border-black rounded-[10px] p-[10px]" style={{ borderLeftWidth: '5px', borderLeftColor: m.color }}>
              <div className="text-[11px] font-black" style={{ color: m.text }}>{m.cat}</div>
              <div className="text-[10px] font-semibold text-[#555] mt-[2px]">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
