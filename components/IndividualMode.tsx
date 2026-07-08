import { useState, useEffect } from "react";
import { STATE_GRID_FACTORS } from "@/utils/data";
import { supabase } from "@/utils/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BarChart3, Search, TrendingUp, MapPin, Zap, Car, Flame, Route, Leaf, Trophy, Target, Award, BrainCircuit, Activity, TreePine, Download, CheckCircle2, Circle } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

const TF: any = {
  "Car": { "Petrol": 0.21, "Diesel": 0.27, "CNG": 0.16, "Electric": 0.06, "N/A": 0.21 },
  "Bike": { "Petrol": 0.09, "Diesel": 0.10, "CNG": 0.07, "Electric": 0.03, "N/A": 0.09 },
  "Bus": { "Petrol": 0.05, "Diesel": 0.06, "CNG": 0.04, "Electric": 0.02, "N/A": 0.05 },
  "Metro": { "Petrol": 0.03, "Diesel": 0.03, "CNG": 0.03, "Electric": 0.03, "N/A": 0.03 },
  "Walk/Cycle": { "Petrol": 0.0, "Diesel": 0.0, "CNG": 0.0, "Electric": 0.0, "N/A": 0.0 },
};

type TabType = "Dashboard" | "Analyse" | "Insights" | "Trends" | "Goals" | "Rewards";

export default function IndividualMode({ userId }: { userId?: string }) {
  const [activeTab, setActiveTab] = useState<TabType>("Analyse");
  
  // Form State
  const [inpState, setInpState] = useState("Tamil Nadu");
  const [units, setUnits] = useState<number | string>("");
  const [distance, setDistance] = useState<number | string>("");
  const [cylinders, setCylinders] = useState<number | string>("");
  const [transport, setTransport] = useState("Car");
  const [vehicle, setVehicle] = useState("Petrol");

  // Real History from Supabase
  const [history, setHistory] = useState<any[]>([]);
  
  // Real LocalStorage Goals
  const [challenges, setChallenges] = useState([
    { id: 1, text: "Walk 5 km instead of driving", done: false, xp: 50 },
    { id: 2, text: "Unplug idle electronics today", done: false, xp: 20 },
    { id: 3, text: "Avoid one LPG usage (eat raw/solar)", done: false, xp: 100 },
    { id: 4, text: "Use public transport for commute", done: false, xp: 80 },
  ]);

  useEffect(() => {
    // Load Goals from local storage
    const savedChallenges = localStorage.getItem('co2iq_challenges');
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    }
    
    // Load History from local storage (Zero Backend Storage)
    const savedHistory = localStorage.getItem('co2iq_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);



  // Derive Results from History or default if new user
  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const totalCo2 = latestEntry ? latestEntry.total_co2 : 0;
  
  let scoreLabel = "No Data 🤷";
  if (totalCo2 > 0) {
    if (totalCo2 < 100) scoreLabel = "Green Hero 🌱";
    else if (totalCo2 < 150) scoreLabel = "Eco Friendly 🍃";
    else if (totalCo2 > 250) scoreLabel = "High Impact 🔥";
    else scoreLabel = "Moderate ⚠️";
  }

  const results = {
    total: totalCo2,
    score: scoreLabel,
    electricity: latestEntry?.electricity_kwh || 0,
    transport: latestEntry?.commute_km || 0,
    lpg: latestEntry?.lpg_cylinders || 0,
    risk: latestEntry?.risk_score || 0
  };

  // --- NEW DYNAMIC INSIGHTS LOGIC ---
  const getDynamicInsights = () => {
    if (results.total === 0) return null;

    // We have to estimate the footprint breakdown if it wasn't strictly saved in columns,
    // but luckily we saved the raw inputs in the DB (electricity_kwh, commute_km, lpg_cylinders)
    // We'll calculate their rough CO2 equivalents dynamically here for insights.
    const elec_co2 = results.electricity * 0.82; 
    const trans_co2 = results.transport * 0.21; 
    const lpg_co2 = results.lpg * 42.3;

    let highestCat = "Electricity";
    let highestVal = elec_co2;
    if (trans_co2 > highestVal) { highestCat = "Transport"; highestVal = trans_co2; }
    if (lpg_co2 > highestVal) { highestCat = "LPG Usage"; highestVal = lpg_co2; }

    const message = `Based on your recent analysis, your **${highestCat}** contributes most significantly to your emissions (~${highestVal.toFixed(1)} kg CO₂). Focusing on this area is the fastest way to reduce your footprint!`;

    let actions = [];
    if (highestCat === "Transport") {
      actions = [
        { t: "Use Public Transport", d: "Taking the bus or metro can reduce transport emissions by up to 85%.", s: Math.floor(highestVal * 0.5) + " kg" },
        { t: "Carpooling", d: "Share rides with colleagues to cut fuel use in half.", s: Math.floor(highestVal * 0.3) + " kg" }
      ];
    } else if (highestCat === "Electricity") {
      actions = [
        { t: "Switch to LED Bulbs", d: "LEDs use 75% less energy than standard incandescent bulbs.", s: Math.floor(highestVal * 0.1) + " kg" },
        { t: "Optimize AC Usage", d: "Set AC to 24°C to save up to 20% on electricity.", s: Math.floor(highestVal * 0.2) + " kg" }
      ];
    } else {
      actions = [
        { t: "Induction Cooking", d: "Supplement LPG with induction to reduce cylinder dependency.", s: Math.floor(highestVal * 0.2) + " kg" },
        { t: "Solar Water Heater", d: "Use solar for heating water instead of LPG stoves.", s: Math.floor(highestVal * 0.3) + " kg" }
      ];
    }
    
    actions.push({ t: "Plant a Tree", d: "A mature tree absorbs ~20 kg of CO2 per year.", s: "20 kg" });

    return { message, actions };
  };

  const insightsData = getDynamicInsights();

  const [loading, setLoading] = useState(false);

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const handleAskVayundhra = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: chatInput,
          type: "individual_expert",
          data: results
        })
      });
      const data = await res.json();
      setChatResponse(data.content || data.error || "Sorry, I couldn't process that.");
    } catch (err) {
      setChatResponse("Error connecting to AI advisor.");
    }
    setChatLoading(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const u = Number(units) || 0;
    const d = Number(distance) || 0;
    const c = Number(cylinders) || 0;

    const state_ef = STATE_GRID_FACTORS[inpState] || 0.82;
    const t_factor = TF[transport]?.[vehicle] || 0.21;

    const elec_co2 = Number((u * state_ef).toFixed(2));
    const trans_co2 = Number((d * t_factor).toFixed(2));
    const lpg_co2 = Number((c * 14.2 * 2.98).toFixed(2));
    const total_co2 = Number((elec_co2 + trans_co2 + lpg_co2).toFixed(2));

    const risk = Math.min(100, Math.max(0, (total_co2 / 300) * 100));

    const newEntry = {
      electricity_kwh: u,
      commute_km: d,
      vehicle_type: vehicle,
      lpg_cylinders: c,
      total_co2: total_co2,
      risk_score: risk,
      state: inpState,
      created_at: new Date().toISOString()
    };
    
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('co2iq_history', JSON.stringify(updatedHistory));
    
    setLoading(false);
    setActiveTab("Dashboard");
  };

  const toggleChallenge = (id: number) => {
    const updated = challenges.map(c => c.id === id ? { ...c, done: !c.done } : c);
    setChallenges(updated);
    localStorage.setItem('co2iq_challenges', JSON.stringify(updated));
  };

  const totalXP = challenges.reduce((acc, c) => c.done ? acc + c.xp : acc, 0);

  // Dynamic Badges
  const badges = [
    { id: 1, name: "First Footprint", icon: "🏅", unlocked: history.length > 0, desc: "Completed your first analysis" },
    { id: 2, name: "Green Starter", icon: "🌱", unlocked: history.length > 0 && history[history.length - 1].total_co2 < 150, desc: "Scored below 150kg" },
    { id: 3, name: "Consistent Tracker", icon: "📅", unlocked: history.length >= 3, desc: "Logged 3 emissions" },
    { id: 4, name: "Eco Warrior", icon: "♻️", unlocked: totalXP >= 100, desc: "Earned 100 XP from challenges" },
    { id: 5, name: "Action Hero", icon: "⚡", unlocked: totalXP >= 200, desc: "Earned 200 XP from challenges" },
    { id: 6, name: "Zero Waste", icon: "🗑️", unlocked: false, desc: "Compost for a week" },
  ];

  // Dynamic Trends Data
  const trendData = history.map((entry, idx) => ({
    month: `Log ${idx + 1}`,
    co2: entry.total_co2,
    target: 150
  }));

  const tabs: { id: TabType, icon: any }[] = [
    { id: "Analyse", icon: BarChart3 },
    { id: "Dashboard", icon: Activity },
    { id: "Insights", icon: BrainCircuit },
    { id: "Trends", icon: TrendingUp },
    { id: "Goals", icon: Target },
    { id: "Rewards", icon: Trophy }
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-nunito max-w-[1100px] mx-auto">
      
      {/* Header Banner */}
      <div className="w-full aspect-[16/7] sm:aspect-[4/1] md:aspect-[5/1] lg:aspect-[5.5/1] rounded-[36px] overflow-hidden relative shadow-md border-[3px] border-white bg-white">
         <Image src="/banner.png" alt="Co2IQ Banner" fill className="object-cover object-center" />
      </div>

      {/* Modern Horizontal Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-2 flex overflow-x-auto hide-scrollbar gap-2 sticky top-4 z-30">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] whitespace-nowrap transition-all ${
              activeTab === t.id 
                ? "bg-[#657733] text-white shadow-md" 
                : "text-[#6B7280] hover:bg-[#F3F4F6]"
            }`}
          >
            <t.icon size={16} strokeWidth={activeTab === t.id ? 2.5 : 2} />
            {t.id}
          </button>
        ))}
      </div>

      {/* Main Tab Content Wrapper - Prevents layout jumping */}
      <div className="w-full min-h-[600px] mb-12">
        {/* === DASHBOARD TAB === */}
      {activeTab === "Dashboard" && (
        <div className="animate-[fadeIn_0.3s_ease] flex flex-col gap-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E7EB] flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full border-[8px] border-[#D7E3A4] flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 border-[8px] border-[#657733] rounded-full border-r-transparent border-t-transparent rotate-45"></div>
                <div className="text-[40px] font-black">{results?.score?.split(' ').pop()}</div>
              </div>
              <h3 className="text-[20px] font-black text-[#291100]">{results?.score?.split(' ').slice(0, -1).join(' ')}</h3>
              <p className="text-[#6B7280] text-[12px] font-bold mt-1">Current Carbon Score</p>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E5E7EB] md:col-span-2 grid grid-cols-2 gap-6">
               <div className="bg-[#ECF5E2] rounded-2xl p-6 flex flex-col justify-center border border-[#D7E3A4] col-span-1 md:col-span-1">
                  <Leaf className="text-[#657733] mb-3" size={28} />
                  <div className="text-[12px] font-bold text-[#657733] uppercase tracking-wider">Total Emissions</div>
                  <div className="text-[40px] font-black text-[#291100] mt-1">{results?.total?.toFixed(1) || 0} <span className="text-[16px] text-[#6B7280]">kg</span></div>
               </div>
               
               <div className="grid grid-rows-2 gap-4 col-span-1 md:col-span-1">
                 <div className="bg-[#FEFCE8] rounded-2xl p-4 flex flex-col justify-center border border-[#D4C04D]">
                    <div className="flex items-center gap-2 mb-1">
                       <TreePine className="text-[#D4C04D]" size={16} />
                       <div className="text-[10px] font-bold text-[#D4C04D] uppercase tracking-wider">Trees Equivalent</div>
                    </div>
                    <div className="text-[24px] font-black text-[#291100]">{(results?.total / 20).toFixed(1)} <span className="text-[12px] text-[#6B7280]">trees/yr</span></div>
                 </div>
                 <div className="bg-[#EFF6FF] rounded-2xl p-4 flex flex-col justify-center border border-[#BFDBFE]">
                    <div className="flex items-center gap-2 mb-1">
                       <Award className="text-[#1D4ED8]" size={16} />
                       <div className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider">Eco Rank</div>
                    </div>
                    <div className="text-[24px] font-black text-[#291100]">Top 28%</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
            <h3 className="text-[16px] font-bold text-[#291100] mb-4 flex items-center gap-2"><MapPin size={18} className="text-[#657733]" /> Regional Comparison</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-[18px] font-bold text-[#291100] leading-snug">
                  You emit <span className="text-[#657733] bg-[#D7E3A4] px-2 py-0.5 rounded-md">15% less</span> than the average person in Tamil Nadu.
                </p>
                <p className="text-[13px] text-[#6B7280] mt-2">Keep up the good work! Your transport emissions are particularly low compared to state averages.</p>
              </div>
              <div className="flex-1 w-full flex flex-col gap-3">
                 <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#291100] mb-1"><span>You ({results?.total} kg)</span> <span>Target</span></div>
                    <div className="w-full bg-[#F3F4F6] rounded-full h-3"><div className="bg-[#657733] h-3 rounded-full w-[40%]"></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[11px] font-bold text-[#291100] mb-1"><span>TN Average (158 kg)</span></div>
                    <div className="w-full bg-[#F3F4F6] rounded-full h-3"><div className="bg-[#9CA3AF] h-3 rounded-full w-[60%]"></div></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === ANALYSE TAB === */}
      {activeTab === "Analyse" && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB] animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center gap-2 mb-6 border-b border-[#F3F4F6] pb-4">
            <div className="w-8 h-8 rounded-full bg-[#D7E3A4] flex items-center justify-center text-[#657733]">
              <BarChart3 size={16} strokeWidth={3} />
            </div>
            <h2 className="text-[18px] font-bold text-[#291100]">Enter Your Usage Data</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#291100] flex items-center gap-2 uppercase tracking-wide">
                  <MapPin size={14} className="text-[#657733]" /> Your State
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#291100] text-[14px] focus:ring-2 focus:ring-[#657733] appearance-none" value={inpState} onChange={e => setInpState(e.target.value)}>
                  {Object.keys(STATE_GRID_FACTORS).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#291100] flex items-center gap-2 uppercase tracking-wide">
                  <Route size={14} className="text-[#657733]" /> Travel Distance (KM/WK)
                </label>
                <input type="number" className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#291100] text-[14px] focus:ring-2 focus:ring-[#657733]" value={distance} onChange={e => setDistance(e.target.value)} placeholder="0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#291100] flex items-center gap-2 uppercase tracking-wide">
                  <Car size={14} className="text-[#657733]" /> Vehicle Type
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#291100] text-[14px] focus:ring-2 focus:ring-[#657733] appearance-none" value={vehicle} onChange={e => setVehicle(e.target.value)}>
                  {["Petrol", "Diesel", "CNG", "Electric", "N/A"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#291100] flex items-center gap-2 uppercase tracking-wide">
                  <Zap size={14} className="text-[#657733]" /> Electricity (KWH/MO)
                </label>
                <input type="number" className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#291100] text-[14px] focus:ring-2 focus:ring-[#657733]" value={units} onChange={e => setUnits(e.target.value)} placeholder="0" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#291100] flex items-center gap-2 uppercase tracking-wide">
                  <Car size={14} className="text-[#657733]" /> Transport Mode
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#291100] text-[14px] focus:ring-2 focus:ring-[#657733] appearance-none" value={transport} onChange={e => setTransport(e.target.value)}>
                  {["Car", "Bike", "Bus", "Metro", "Walk/Cycle"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#291100] flex items-center gap-2 uppercase tracking-wide">
                  <Flame size={14} className="text-[#657733]" /> LPG Cylinders (/MO)
                </label>
                <input type="number" className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#291100] text-[14px] focus:ring-2 focus:ring-[#657733]" value={cylinders} onChange={e => setCylinders(e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full md:w-auto bg-[#657733] hover:bg-[#14532D] text-white px-8 py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            {loading ? <div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div> : <Search size={18} />}
            <span>{loading ? "Analysing & Saving..." : "Analyse Footprint →"}</span>
          </button>
        </div>
      )}

      {/* === AI INSIGHTS TAB === */}
      {activeTab === "Insights" && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB] animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#1D4ED8] relative">
              <BrainCircuit size={20} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#3B82F6] border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#291100]">Vayundhra AI Insights</h2>
              <p className="text-[13px] text-[#6B7280]">Personalized carbon reduction roadmap</p>
            </div>
          </div>

          {insightsData ? (
            <>
              <div className="bg-[#ECF5E2] border border-[#D7E3A4] rounded-2xl p-6 mb-6">
                 <p className="text-[14px] text-[#657733] font-medium leading-relaxed">
                   {insightsData.message}
                 </p>
              </div>

              <h3 className="text-[14px] font-bold text-[#291100] mb-4">Recommended Actions:</h3>
              <div className="flex flex-col gap-3 mb-8">
                 {insightsData.actions.map((a, i) => (
                   <div key={i} className="flex justify-between items-center p-4 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] cursor-pointer transition-colors">
                      <div>
                         <div className="font-bold text-[#291100] text-[14px]">{a.t}</div>
                         <div className="text-[12px] text-[#6B7280]">{a.d}</div>
                      </div>
                      <div className="bg-[#D7E3A4] text-[#657733] text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                        -{a.s} CO₂
                      </div>
                   </div>
                 ))}
              </div>
            </>
          ) : (
             <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] rounded-2xl text-center mb-8">
                <BrainCircuit size={40} className="text-[#D1D5DB] mb-3" />
                <h3 className="text-[#291100] font-bold">No Analysis Yet</h3>
                <p className="text-[#6B7280] text-[13px] mt-1">Analyse your footprint to get personalized AI recommendations!</p>
             </div>
          )}

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6">
            <h3 className="text-[14px] font-bold text-[#291100] mb-4 flex items-center gap-2">
              <BrainCircuit size={16} className="text-[#3B82F6]"/> Ask Vayundhra
            </h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask about reducing your footprint..."
                className="flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#291100] text-[14px] focus:ring-2 focus:ring-[#3B82F6]"
                onKeyDown={e => e.key === 'Enter' && handleAskVayundhra()}
              />
              <button onClick={handleAskVayundhra} disabled={chatLoading} className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 rounded-xl font-bold transition-colors">
                {chatLoading ? "..." : "Ask"}
              </button>
            </div>
            {chatResponse && (
              <div className="mt-4 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-[14px] text-[#1E3A8A] leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 flex flex-col gap-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 flex flex-col gap-1" {...props} />,
                    li: ({node, ...props}) => <li className="text-[14px]" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-[#1E40AF]" {...props} />,
                  }}
                >
                  {chatResponse}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === TRENDS TAB === */}
      {activeTab === "Trends" && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB] animate-[fadeIn_0.3s_ease]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[18px] font-bold text-[#291100] flex items-center gap-2"><TrendingUp size={20} className="text-[#657733]"/> Your Emission History</h2>
            <button className="text-[12px] font-bold flex items-center gap-1 text-[#1D4ED8] bg-[#EFF6FF] px-3 py-1.5 rounded-lg"><Download size={14}/> Export CSV</button>
          </div>
          
          {history.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#657733" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#657733" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="co2" name="Your CO₂" stroke="#657733" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
                  <Line type="monotone" dataKey="target" name="Target" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-[#E5E7EB] rounded-2xl text-center">
                <BarChart3 size={40} className="text-[#D1D5DB] mb-3" />
                <h3 className="text-[#291100] font-bold">No History Yet</h3>
                <p className="text-[#6B7280] text-[13px] mt-1">Analyse your footprint to see your trends graph here!</p>
             </div>
          )}
        </div>
      )}


      {/* === GOALS TAB === */}
      {activeTab === "Goals" && (
        <div className="animate-[fadeIn_0.3s_ease] flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB]">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-[18px] font-bold text-[#291100] flex items-center gap-2"><Target size={20} className="text-[#657733]" /> Monthly Goal Progress</h2>
               <div className="text-[12px] font-black text-[#D4C04D] bg-[#D4C04D] px-3 py-1 rounded-lg border border-[#FDE047]">
                 TOTAL XP: {totalXP}
               </div>
             </div>
             
             <div className="flex justify-between text-[14px] font-bold text-[#291100] mb-2">
               <span>Complete challenges to level up</span>
               <span className="text-[#657733]">{(totalXP / 250 * 100).toFixed(0)}% to Level 2</span>
             </div>
             <div className="w-full bg-[#F3F4F6] rounded-full h-4 mb-2 overflow-hidden">
                <div className="bg-[#657733] h-full rounded-full transition-all duration-1000 relative" style={{ width: `${Math.min(100, (totalXP / 250) * 100)}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB]">
             <h2 className="text-[18px] font-bold text-[#291100] mb-6 flex items-center gap-2"><Activity size={20} className="text-[#657733]" /> Daily Eco Challenges</h2>
             <div className="flex flex-col gap-3">
               {challenges.map(c => (
                 <div key={c.id} onClick={() => toggleChallenge(c.id)} className={`flex items-center justify-between p-4 rounded-xl border ${c.done ? 'bg-[#ECF5E2] border-[#D7E3A4]' : 'bg-white border-[#E5E7EB]'} transition-colors cursor-pointer hover:border-[#657733]`}>
                    <div className="flex items-center gap-3">
                      {c.done ? <CheckCircle2 className="text-[#657733]" size={20} /> : <Circle className="text-[#D1D5DB]" size={20} />}
                      <span className={`text-[14px] font-bold ${c.done ? 'text-[#657733] line-through opacity-70' : 'text-[#291100]'}`}>{c.text}</span>
                    </div>
                    <div className="bg-[#D4C04D] text-[#D4C04D] text-[11px] font-black px-2 py-1 rounded-md">+{c.xp} XP</div>
                 </div>
               ))}
             </div>
             
             <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                <h3 className="text-[14px] font-bold text-[#291100] mb-3 flex items-center gap-2">
                  <BrainCircuit size={16} className="text-[#3B82F6]"/> Need custom challenges? Ask Vayundhra!
                </h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    placeholder="Suggest some weekend challenges..."
                    className="flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#291100] text-[14px] focus:ring-2 focus:ring-[#3B82F6]"
                    onKeyDown={e => e.key === 'Enter' && handleAskVayundhra()}
                  />
                  <button onClick={handleAskVayundhra} disabled={chatLoading} className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 rounded-xl font-bold transition-colors">
                    {chatLoading ? "..." : "Ask"}
                  </button>
                </div>
                {chatResponse && (
                  <div className="mt-4 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-[14px] text-[#1E3A8A] leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 flex flex-col gap-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 flex flex-col gap-1" {...props} />,
                        li: ({node, ...props}) => <li className="text-[14px]" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-[#1E40AF]" {...props} />,
                      }}
                    >
                      {chatResponse}
                    </ReactMarkdown>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* === REWARDS TAB === */}
      {activeTab === "Rewards" && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB] animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-[18px] font-bold text-[#291100] flex items-center gap-2"><Trophy size={20} className="text-[#D4C04D]" /> Badges & Achievements</h2>
             <div className="bg-[#FEFCE8] border border-[#D4C04D] text-[#D4C04D] font-bold text-[13px] px-4 py-2 rounded-xl">
               Level {Math.floor(totalXP / 250) + 1} Eco Warrior
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {badges.map(b => (
              <div key={b.id} className={`flex flex-col items-center text-center p-6 rounded-2xl border ${b.unlocked ? 'border-[#E5E7EB] bg-white shadow-sm' : 'border-[#F3F4F6] bg-[#F9FAFB] opacity-60 grayscale'}`}>
                 <div className="text-[48px] mb-3">{b.icon}</div>
                 <div className="font-bold text-[#291100] text-[14px]">{b.name}</div>
                 <div className="text-[11px] text-[#6B7280] mt-1">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
