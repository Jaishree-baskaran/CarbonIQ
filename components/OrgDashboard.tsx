import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { INDIA_NATIONAL } from "@/utils/data";
import { 
  Users, Globe, Search, ChevronLeft, ChevronRight, 
  Bell, Calendar, ShieldCheck, TrendingUp, Leaf, CloudLightning,
  Activity, Wind, Sun, BatteryCharging, Zap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function OrgDashboard() {
  const { profile } = useAuth();
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

  const MiniChart = ({ color }: { color: string }) => (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-6 right-6 opacity-60">
      <path d="M2 20C8 20 10 12 16 12C22 12 24 16 30 16C36 16 38 6 46 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="w-full font-sans bg-transparent max-w-[1200px] mx-auto mt-4 pb-12">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
        <div>
          <h1 className="text-[32px] font-bold text-[#111] flex items-center gap-2 font-fredoka tracking-wide">
            Good morning, {profile?.full_name ? profile.full_name.split(' ')[0] : 'Admin'}! <span className="text-[#5b872b]"><Leaf size={26} strokeWidth={2.5} /></span>
          </h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">
            Here's what's happening with your organization today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-[20px] px-5 py-3">
            <Calendar size={18} className="text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-gray-800 leading-tight">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric'})}</span>
              <span className="text-[10px] text-gray-400 font-bold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <button className="w-[52px] h-[52px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] rounded-[20px] flex items-center justify-center relative hover:bg-gray-50 transition-colors">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute top-[14px] right-[14px] w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards - Pure White Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Card 1 */}
        <div className="relative bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F0F5EC] flex items-center justify-center shrink-0">
              <Users size={22} className="text-[#6C9A44]" />
            </div>
            <div className="flex flex-col z-10">
              <span className="text-[11px] font-bold text-gray-400 mb-1">Total Users</span>
              <span className="text-[36px] font-fredoka font-medium text-[#111] leading-none">{totalUsers}</span>
              <span className="text-[10.5px] font-bold text-gray-400 mt-4">Across all members</span>
            </div>
          </div>
          <MiniChart color="#6C9A44" />
        </div>

        {/* Card 2 */}
        <div className="relative bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ECF3ED] flex items-center justify-center shrink-0">
              <CloudLightning size={22} className="text-[#4E8B2C]" />
            </div>
            <div className="flex flex-col z-10">
              <span className="text-[11px] font-bold text-gray-400 mb-1">Total CO₂</span>
              <span className="text-[36px] font-fredoka font-medium text-[#111] leading-none">{totalCo2.toFixed(1)} <span className="text-[14px] text-gray-400 font-sans font-bold">kg</span></span>
              <span className="text-[10.5px] font-bold text-gray-400 mt-4">This month</span>
            </div>
          </div>
          <MiniChart color="#4E8B2C" />
        </div>

        {/* Card 3 */}
        <div className="relative bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF3EB] flex items-center justify-center shrink-0">
              <ShieldCheck size={22} className="text-[#C26B24]" />
            </div>
            <div className="flex flex-col z-10">
              <span className="text-[11px] font-bold text-gray-400 mb-1">Avg Risk Score</span>
              <span className="text-[36px] font-fredoka font-medium text-[#111] leading-none">{Math.round(avgRisk)}%</span>
              <span className="text-[10.5px] font-bold text-gray-400 mt-4">Organization risk</span>
            </div>
          </div>
          <MiniChart color="#F39C12" />
        </div>

        {/* Card 4 */}
        <div className="relative bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F0F6FB] flex items-center justify-center shrink-0">
              <TrendingUp size={22} className="text-[#2F6891]" />
            </div>
            <div className="flex flex-col z-10">
              <span className="text-[11px] font-bold text-gray-400 mb-1">High Risk Users</span>
              <span className="text-[36px] font-fredoka font-medium text-[#111] leading-none">{highRiskUsers}</span>
              <span className="text-[10.5px] font-bold text-gray-400 mt-4">Requires attention</span>
            </div>
          </div>
          <MiniChart color="#3498DB" />
        </div>

      </div>

      {/* Vayundhra AI Banner - Glassy Version */}
      <div className="relative w-full rounded-[32px] bg-white/40 backdrop-blur-[16px] p-8 md:p-12 mb-8 overflow-hidden flex flex-col md:flex-row items-center justify-between border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="relative z-10 max-w-[600px]">
          <div className="flex items-center gap-2 text-[#1B4332] font-bold text-[20px] font-fredoka mb-4">
            Vayundhra AI Strategy
          </div>
          <p className="text-[13px] font-medium text-gray-700 leading-[1.7] mb-6 max-w-[450px]">
            Hello {profile?.full_name ? profile.full_name.split(' ')[0] : 'Admin'}, I am Vayundhra. I have analyzed the aggregate data for your {totalUsers} members. The current organizational risk is {Math.round(avgRisk)}%. 
            <br/><br/>
            Here is your strategy for reduction...
          </p>

          {!aiResponse && !aiLoading && (
            <button onClick={generateStrategy} className="bg-[#1B4332] hover:bg-[#153427] text-white px-6 py-3.5 rounded-full font-bold text-[12px] transition-all flex items-center gap-2 shadow-lg shadow-[#1B4332]/20">
              Generate Org Recommendations <Leaf size={14} />
            </button>
          )}
          {aiLoading && !aiResponse && (
            <div className="text-[13px] font-bold text-[#1B4332] flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-[#1B4332]/30 border-t-[#1B4332] rounded-full animate-spin"></div>
              Analyzing org data...
            </div>
          )}
          {aiResponse && (
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/80 text-[13px] font-medium text-[#1B4332] leading-[1.6] whitespace-pre-wrap max-h-[250px] overflow-y-auto custom-scrollbar shadow-sm">
              {aiResponse}
            </div>
          )}
        </div>

        {/* 3D Glassy Globe Placeholder */}
        <div className="hidden md:block w-[320px] h-[320px] relative z-10 shrink-0 bg-[url('/sidebar_promo_3d.png')] bg-contain bg-center bg-no-repeat opacity-95 drop-shadow-xl -mr-10">
        </div>

        {/* Soft background glows for glassmorphism */}
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#E8F3DE]/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Bottom Grid: Tables & Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
        {/* Left Col: Users Table */}
        <div className="xl:col-span-3 bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3 font-fredoka text-[18px] text-gray-800">
              <Users size={22} className="text-gray-500" /> All Users — Emission Log
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search ID or State..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-full text-[12px] font-medium text-gray-700 outline-none focus:bg-white focus:ring-2 focus:ring-[#EAF0E4] transition-all w-[220px]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="bg-[#EAF0E4]">
                  <th className="py-3 px-5 font-black text-[#1b4332] text-[10px] tracking-wider uppercase">User ID</th>
                  <th className="py-3 px-5 font-black text-[#1b4332] text-[10px] tracking-wider uppercase">State</th>
                  <th className="py-3 px-5 font-black text-[#1b4332] text-[10px] tracking-wider uppercase">Total CO₂</th>
                  <th className="py-3 px-5 font-black text-[#1b4332] text-[10px] tracking-wider uppercase">Risk</th>
                  <th className="py-3 px-5 font-black text-[#1b4332] text-[10px] tracking-wider uppercase">Profile</th>
                  <th className="py-3 px-5 font-black text-[#1b4332] text-[10px] tracking-wider uppercase">Logged At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 bg-white/40">
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-10 text-gray-400 font-medium">Loading data...</td></tr>
                ) : currentEmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-16">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <Activity size={24} className="text-gray-300" />
                      </div>
                      <span className="text-gray-400 font-medium text-[13px]">No user data found.</span>
                    </td>
                  </tr>
                ) : (
                  currentEmissions.map((e, idx) => (
                    <tr key={idx} className="hover:bg-white/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-gray-700">{e.user_id.substring(0,8)}...</td>
                      <td className="py-3.5 px-5 font-medium text-gray-600">{e.state}</td>
                      <td className="py-3.5 px-5 font-bold text-[#5a8a00]">{e.total?.toFixed(1)}</td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${e.risk_score > 66 ? 'bg-red-50 text-red-600 border border-red-100' : e.risk_score > 33 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                          {Math.round(e.risk_score)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-medium text-gray-500">{e.profile}</td>
                      <td className="py-3.5 px-5 text-gray-400 text-[11px] font-bold">{new Date(e.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-white/50 flex items-center justify-between bg-white/30">
              <span className="text-[11px] font-bold text-gray-500">
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredEmissions.length)} of {filteredEmissions.length}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft size={14} className="text-gray-600" />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight size={14} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: MoEFCC Stats */}
        <div className="xl:col-span-2 bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-6">
          <div className="font-fredoka text-[18px] text-gray-800 flex items-center gap-2 mb-6">
            <Globe size={20} className="text-gray-500" /> 
            India National Stats <span className="text-gray-400 text-[12px] font-sans font-medium ml-1 mt-1">· MoEFCC 2023–24</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 mb-1">Total CO₂</div>
              <div className="font-fredoka text-[24px] text-[#2F7E6B]">{n.total_co2_gt}</div>
              <div className="text-[9px] text-gray-400 font-bold mt-1">Gt / year</div>
              <Leaf size={28} strokeWidth={1.5} className="absolute bottom-3 right-3 text-emerald-600/20" />
            </div>

            <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 mb-1">Global Rank</div>
              <div className="font-fredoka text-[24px] text-[#E8833A]">#{n.rank_global}</div>
              <div className="text-[9px] text-gray-400 font-bold mt-1">In emissions</div>
              <Globe size={28} strokeWidth={1.5} className="absolute bottom-3 right-3 text-[#E8833A]/20" />
            </div>

            <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 mb-1">Per-Capita</div>
              <div className="font-fredoka text-[24px] text-[#2F7E6B]">{n.percapita_tonnes}</div>
              <div className="text-[9px] text-gray-400 font-bold mt-1">t / year</div>
              <Users size={28} strokeWidth={1.5} className="absolute bottom-3 right-3 text-[#2F7E6B]/20" />
            </div>

            <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 mb-1">Renewable</div>
              <div className="font-fredoka text-[24px] text-[#2F6891]">{n.renewable_pct}%</div>
              <div className="text-[9px] text-gray-400 font-bold mt-1">Of total installed</div>
              <Zap size={28} strokeWidth={1.5} className="absolute bottom-3 right-3 text-[#2F6891]/20" />
            </div>

            <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 mb-1">Solar Installed</div>
              <div className="font-fredoka text-[24px] text-[#4E8B2C]">{n.solar_gw} GW</div>
              <div className="text-[9px] text-gray-400 font-bold mt-1">Total Capacity</div>
              <Sun size={28} strokeWidth={1.5} className="absolute bottom-3 right-3 text-[#4E8B2C]/20" />
            </div>

            <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-gray-50">
              <div className="text-[10px] font-bold text-gray-400 mb-1">EV Sales FY24</div>
              <div className="font-fredoka text-[24px] text-[#4E8B2C]">{n.ev_sales_2024}M</div>
              <div className="text-[9px] text-gray-400 font-bold mt-1">Total sales</div>
              <BatteryCharging size={28} strokeWidth={1.5} className="absolute bottom-3 right-3 text-[#4E8B2C]/20" />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
