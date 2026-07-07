import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { INDIA_NATIONAL } from "@/utils/data";
import { Building2, BarChart3, Users, Globe, Lightbulb, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function OrgDashboard() {
  const [emissions, setEmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("emissions").select("*").order("created_at", { ascending: false });
      if (data) setEmissions(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalUsers = new Set(emissions.map(e => e.user_id)).size || emissions.length;
  const totalCo2 = emissions.reduce((acc, e) => acc + (e.total || 0), 0);
  const avgRisk = emissions.length ? emissions.reduce((acc, e) => acc + (e.risk_score || 0), 0) / emissions.length : 0;
  const highRiskUsers = emissions.filter(e => e.risk_score > 66).length;

  const filteredEmissions = emissions.filter(e => 
    e.user_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.state.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.max(1, Math.ceil(filteredEmissions.length / rowsPerPage));
  const currentEmissions = filteredEmissions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const generateStrategy = async () => {
    setAiLoading(true);
    try {
      const payload = {
        type: "org_admin",
        data: {
          totalUsers,
          totalCo2,
          avgRisk,
          highRiskUsers,
          topStates: Array.from(new Set(emissions.map(e => e.state))).join(", ")
        }
      };
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        setAiResponse("");
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          setAiResponse((prev) => (prev || "") + text);
        }
      } else {
        setAiResponse("Failed to generate strategy.");
      }
    } catch (e) {
      setAiResponse("Error generating strategy.");
    }
    setAiLoading(false);
  };

  const n = INDIA_NATIONAL;

  return (
    <div className="w-full">


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="metric-card after:bg-lime after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Total Users</div>
          <div className="font-fredoka text-[28px] text-[#5a8a00] leading-none">{totalUsers}</div>
        </div>
        <div className="metric-card after:bg-pink after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Total CO₂</div>
          <div className="font-fredoka text-[28px] text-pink leading-none">{totalCo2.toFixed(1)}</div>
          <div className="text-[10px] font-bold text-black/40 mt-1">kg this month</div>
        </div>
        <div className="metric-card after:bg-orange after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Avg Risk Score</div>
          <div className="font-fredoka text-[28px] text-orange leading-none">{Math.round(avgRisk)}%</div>
        </div>
        <div className="metric-card after:bg-blue after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1 flex items-center gap-1">
            High Risk Users
            {highRiskUsers > 0 && <span className="w-[6px] h-[6px] bg-red rounded-full animate-pulse shadow-[0_0_8px_#FF4757]"></span>}
          </div>
          <div className="font-fredoka text-[28px] text-[#0077aa] leading-none">{highRiskUsers}</div>
        </div>
      </div>

      <div className="neo-card mb-5 bg-black text-lime border-[3px] border-black rounded-[24px] relative">
        <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
          <div className="w-[24px] h-[24px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#a8f0c6,#26C6DA_50%,#0e8fa0)] border-[2px] border-lime shrink-0 relative animate-bobb">
            <div className="absolute top-[4px] left-[5px] w-[6px] h-[4px] bg-white/55 rounded-full -rotate-25"></div>
          </div>
          Vayundhra AI Strategy
        </div>
        <p className="text-[13px] font-semibold text-lime/80 mb-4 leading-[1.6]">
          Hello Admin, I am Vayundhra. I have analyzed the aggregate data for your {totalUsers} members. The current organizational risk is {Math.round(avgRisk)}%. Here is your strategy for reduction...
        </p>
        
        {!aiResponse && !aiLoading && (
          <button onClick={generateStrategy} className="neo-btn bg-lime text-black border-lime font-bold text-[14px] py-2 px-4 shadow-[4px_4px_0_#C8E63C] hover:shadow-[6px_6px_0_#C8E63C]">
            Generate Org Recommendations
          </button>
        )}
        {aiLoading && !aiResponse && (
          <div className="text-[13px] font-bold text-lime animate-pulse">Analyzing org data...</div>
        )}
        {aiResponse && (
          <div className="mt-2 pt-4 border-t border-lime/30 text-[13px] font-medium text-lime/90 leading-[1.6] whitespace-pre-wrap">
            {aiResponse}
          </div>
        )}
      </div>

      <div className="neo-card mb-5 border-[3px] border-black rounded-[24px]">
        <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center justify-between gap-[8px]">
          <div className="flex items-center gap-2">
            <Users size={20} strokeWidth={2.5} className="text-black" /> All Users — Emission Log
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
            <input 
              type="text" 
              placeholder="Search ID or State..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-[6px] border-[2px] border-black rounded-full text-[11px] font-bold outline-none focus:bg-lime/20 transition-colors w-[200px]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                <th className="p-[9px_12px] text-left bg-black text-lime text-[10px] font-black tracking-[0.08em] uppercase rounded-tl-[8px]">User ID</th>
                <th className="p-[9px_12px] text-left bg-black text-lime text-[10px] font-black tracking-[0.08em] uppercase">State</th>
                <th className="p-[9px_12px] text-left bg-black text-lime text-[10px] font-black tracking-[0.08em] uppercase">Total CO₂</th>
                <th className="p-[9px_12px] text-left bg-black text-lime text-[10px] font-black tracking-[0.08em] uppercase">Risk</th>
                <th className="p-[9px_12px] text-left bg-black text-lime text-[10px] font-black tracking-[0.08em] uppercase">Profile</th>
                <th className="p-[9px_12px] text-left bg-black text-lime text-[10px] font-black tracking-[0.08em] uppercase rounded-tr-[8px]">Logged At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center text-[#aaa] p-[24px] font-bold border-b-[2px] border-[#eee]">Loading data...</td>
                </tr>
              ) : currentEmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-[#aaa] p-[24px] font-bold border-b-[2px] border-[#eee]">No user data found.</td>
                </tr>
              ) : (
                currentEmissions.map((e, idx) => (
                  <tr key={idx} className="border-b-[2px] border-[#eee] hover:bg-[#f9f9f9]">
                    <td className="p-[9px_12px] font-bold text-black/60 truncate max-w-[80px]">{e.user_id.substring(0,8)}...</td>
                    <td className="p-[9px_12px] font-bold text-black">{e.state}</td>
                    <td className="p-[9px_12px] font-black text-[#5a8a00]">{e.total?.toFixed(1)}</td>
                    <td className="p-[9px_12px] font-bold">
                      <span className={`px-2 py-1 rounded-[4px] text-[10px] text-white ${e.risk_score > 66 ? 'bg-[#FF4757]' : e.risk_score > 33 ? 'bg-[#FFA500]' : 'bg-[#C8E63C] text-black'}`}>
                        {Math.round(e.risk_score)}
                      </span>
                    </td>
                    <td className="p-[9px_12px] font-bold text-black/70">{e.profile}</td>
                    <td className="p-[9px_12px] font-bold text-black/50 text-[10px]">{new Date(e.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-[11px] font-bold text-black/50">
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredEmissions.length)} of {filteredEmissions.length} entries
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-[28px] h-[28px] flex items-center justify-center border-[2px] border-black rounded-[8px] bg-white disabled:opacity-50 hover:bg-lime/20"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-[28px] h-[28px] flex items-center justify-center border-[2px] border-black rounded-[8px] bg-white disabled:opacity-50 hover:bg-lime/20"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="neo-card">
        <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
          <Globe size={20} strokeWidth={2.5} className="text-black" /> India National Stats · MoEFCC 2023–24
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-[16px]">
          <div className="metric-card after:bg-pink after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
            <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Total CO₂</div>
            <div className="font-fredoka text-[20px] text-pink leading-none">{n.total_co2_gt}</div>
            <div className="text-[10px] font-bold text-black/40 mt-1">Gt / year</div>
          </div>
          <div className="metric-card after:bg-orange after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
            <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Global Rank</div>
            <div className="font-fredoka text-[20px] text-orange leading-none">#{n.rank_global}</div>
          </div>
          <div className="metric-card after:bg-lime after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
            <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Per-capita</div>
            <div className="font-fredoka text-[20px] text-[#5a8a00] leading-none">{n.percapita_tonnes}</div>
            <div className="text-[10px] font-bold text-black/40 mt-1">t / year</div>
          </div>
          <div className="metric-card after:bg-blue after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
            <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Renewable</div>
            <div className="font-fredoka text-[20px] text-[#0077aa] leading-none">{n.renewable_pct}%</div>
          </div>
          <div className="metric-card after:bg-teal after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
            <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Solar Installed</div>
            <div className="font-fredoka text-[20px] text-[#005f6b] leading-none">{n.solar_gw} GW</div>
          </div>
          <div className="metric-card after:bg-lime after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
            <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">EV Sales FY24</div>
            <div className="font-fredoka text-[20px] text-[#5a8a00] leading-none">1.68M</div>
          </div>
        </div>
      </div>
    </div>
  );
}
