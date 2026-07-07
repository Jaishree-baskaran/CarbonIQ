import { useState, useEffect } from "react";
import { STATE_POLICIES, STATE_GRID_FACTORS, STATE_PERCAPITA_CO2 } from "@/utils/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ClipboardList, Landmark, Search, AlertTriangle, Star, TrendingUp } from "lucide-react";
import useSWR from 'swr';
import { fetchStatePolicies } from "@/utils/supabase/data";

export default function PolicyHub() {
  const { data: dbStates, isValidating } = useSWR('states', fetchStatePolicies);

  const statesData = (dbStates && dbStates.length > 0)
    ? dbStates.reduce((acc: any, curr: any) => ({...acc, [curr.name || curr.state]: curr}), {})
    : STATE_POLICIES;

  const stateKeys = Object.keys(statesData);
  const [selState, setSelState] = useState(stateKeys[0] || "Andhra Pradesh");

  useEffect(() => {
    if (stateKeys.length > 0 && !stateKeys.includes(selState)) {
      setSelState(stateKeys[0]);
    }
  }, [stateKeys, selState]);

  const currentKey = stateKeys.includes(selState) ? selState : stateKeys[0];
  const sp = statesData[currentKey] || {};
  
  const policies = Object.values(statesData) as any[];
  const avgRen = policies.length ? policies.reduce((a, b) => a + (b.ren_pct || 0), 0) / policies.length : 0;
  const evStates = policies.filter(p => p.ev_policy === "Yes" || p.ev_policy === true).length;

  const gef = sp.grid_factor || STATE_GRID_FACTORS[currentKey] || 0.82;
  const pc = sp.per_capita_co2 || STATE_PERCAPITA_CO2[currentKey] || 2.0;

  const rc: any = {
    "A+":"#4ade80","A":"#86efac","B+":"#bef264","B":"#fbbf24","B-":"#f97316",
    "C+":"#fb923c","C":"#f87171","C-":"#ef4444","D+":"#dc2626","D":"#991b1b"
  };
  const rcol = rc[sp.green_rating] || "#6b7c6d";

  const chartData = Object.entries(statesData)
    .map(([state, data]: [string, any]) => ({ state, ren_pct: data.ren_pct || 0 }))
    .sort((a, b) => b.ren_pct - a.ren_pct);

  return (
    <div className="w-full">


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="metric-card after:bg-lime after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">States Tracked</div>
          <div className="font-fredoka text-[28px] text-[#5a8a00] leading-none">{stateKeys.length}</div>
        </div>
        <div className="metric-card after:bg-blue after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Avg Renewable Share</div>
          <div className="font-fredoka text-[28px] text-[#0077aa] leading-none">{Math.round(avgRen)}%</div>
        </div>
        <div className="metric-card after:bg-teal after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">EV Policy States</div>
          <div className="font-fredoka text-[28px] text-[#005f6b] leading-none">{evStates}/{stateKeys.length}</div>
        </div>
        <div className="metric-card after:bg-orange after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">India NDC Target</div>
          <div className="font-nunito font-black text-[13px] mt-1">45% cut by 2030</div>
        </div>
      </div>

      <div className="neo-card mb-5 relative overflow-hidden">
        <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
          <Search size={20} strokeWidth={2.5} className="text-black" /> Explore a State
        </div>
        <select 
          className="neo-input mb-[16px] max-w-md relative z-10"
          value={currentKey} 
          onChange={e => setSelState(e.target.value)}
        >
          {stateKeys.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {isValidating ? (
          <div className="animate-pulse">
            <div className="flex items-center gap-[14px] mb-[16px]">
              <div className="w-[64px] h-[64px] rounded-full bg-black/10"></div>
              <div>
                <div className="w-[120px] h-[24px] bg-black/10 rounded-[20px] mb-1"></div>
                <div className="w-[80px] h-[12px] bg-black/5 rounded-[4px]"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-[16px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="metric-card !p-3">
                  <div className="w-[60px] h-[10px] bg-black/10 mb-2 rounded"></div>
                  <div className="w-[50px] h-[20px] bg-black/10 mb-2 rounded"></div>
                </div>
              ))}
            </div>
            <div className="h-[40px] bg-black/5 rounded-[10px]"></div>
          </div>
        ) : (
          <div className="animate-[fadeIn_0.3s_ease]">
            <div className="flex items-center gap-[14px] mb-[16px]">
              <div className="w-[64px] h-[64px] rounded-full border-[4px] border-black flex items-center justify-center font-fredoka text-[22px] shrink-0 bg-white" style={{ borderColor: rcol, color: rcol }}>
                {sp.green_rating || "?"}
              </div>
              <div>
                <div className="font-fredoka text-[20px]">{currentKey}</div>
                <div className="text-[11px] font-bold text-black/45 mt-[2px]">Green Rating</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-[16px]">
              {[
                { label: "Renewable Share", val: `${sp.ren_pct || 0}%` },
                { label: "EV Policy", val: sp.ev_policy === true ? "Yes" : (sp.ev_policy || "No") },
                { label: "Net Zero Target", val: sp.net_zero_target || sp.target_year || "N/A" },
                { label: "Grid Factor", val: `${gef} kg/kWh` },
                { label: "Per-capita CO2", val: `${pc} t/year` }
              ].map((m, i) => (
                <div key={i} className="metric-card !p-3">
                  <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">{m.label}</div>
                  <div className="font-fredoka text-[20px] text-black leading-none">{m.val}</div>
                </div>
              ))}
            </div>

            {(sp.key_policy || sp.policy_details) && (
              <div className="bg-[#f8f8f2] border-[2.5px] border-black rounded-[10px] p-[12px] text-[12px] font-bold leading-[1.65] text-[#333]">
                <strong>Key Policy: </strong> {sp.key_policy || sp.policy_details}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {(sp.ren_pct || 0) < 20 && (
          <div className="neo-card !mb-0 bg-red text-white">
            <span className="font-bold inline-flex items-center gap-1"><AlertTriangle size={16} strokeWidth={2.5} /> Warning:</span> {currentKey} has low renewable penetration ({sp.ren_pct || 0}%). Grid factor {gef} kg/kWh is above national average. Urgent: coal transition needed.
          </div>
        )}
        {(sp.ren_pct || 0) > 60 && (
          <div className="neo-card !mb-0 bg-lime text-black">
            <span className="font-bold inline-flex items-center gap-1"><Star size={16} strokeWidth={2.5} /> Leader:</span> {currentKey} is a green energy leader at {sp.ren_pct || 0}% renewable. Grid factor {gef} kg/kWh is among India's lowest.
          </div>
        )}
      </div>

      <div className="neo-card">
        <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
          <TrendingUp size={20} strokeWidth={2.5} className="text-black" /> All states — Renewable energy share
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="state" stroke="#111" tick={{fontFamily: 'Nunito', fontWeight: 800, fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#111" tick={{fontFamily: 'Nunito', fontWeight: 800, fontSize: 10}} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#FAFFF0', borderColor: '#111', borderWidth: '3px', borderRadius: '10px', boxShadow: '4px 4px 0 #111', color: '#111', fontWeight: 800 }} />
              <Bar dataKey="ren_pct" fill="#C8E63C" radius={[4, 4, 0, 0]} stroke="#111" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
