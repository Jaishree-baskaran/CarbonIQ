import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Wind, Trash2, BarChart3, MapPin, Recycle, Archive, Pickaxe } from "lucide-react";

export default function MethaneTracker() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchLiveMethane() {
      try {
        const res = await fetch(`/api/methane?t=${Date.now()}`);
        const json = await res.json();
        if (json.success && json.data) {
          const mappedData = json.data.map((item: any, i: number) => ({
            site: item.facility_name || `Unknown Site ${i + 1}`,
            ch4: item.emission_rate || 0
          })).sort((a: any, b: any) => b.ch4 - a.ch4);
          setData(mappedData);
        }
      } catch (err) {
        console.error("Failed to fetch methane data", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLiveMethane();
    // Connect to everyday live updates by polling every 60 seconds
    intervalId = setInterval(fetchLiveMethane, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const total_ch4 = data.reduce((acc, curr) => acc + curr.ch4, 0);
  const highest_ch4 = data.length > 0 ? data[0].ch4 : 0;
  const highest_site = data.length > 0 ? data[0].site : "N/A";

  return (
    <div className="w-full">


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="metric-card after:bg-orange after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Sites Tracked</div>
          {loading ? (
             <div className="font-bold text-black/50 text-[11px] animate-pulse py-2">Fetching Live Data...</div>
          ) : (
             <div className="font-fredoka text-[28px] text-orange leading-none">{data.length}</div>
          )}
        </div>
        <div className="metric-card after:bg-pink after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Highest CH₄</div>
          {loading ? (
             <div className="font-bold text-black/50 text-[11px] animate-pulse py-2">Fetching Live Data...</div>
          ) : (
             <>
               <div className="font-fredoka text-[28px] text-pink leading-none">{highest_ch4.toFixed(1)}</div>
               <div className="text-[10px] font-bold text-black/40 mt-1">kt/yr · {highest_site}</div>
             </>
          )}
        </div>
        <div className="metric-card after:bg-lime after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">India Global Rank</div>
          <div className="font-fredoka text-[28px] text-[#5a8a00] leading-none">#3</div>
          <div className="text-[10px] font-bold text-black/40 mt-1">CH₄ emitter</div>
        </div>
        <div className="metric-card after:bg-blue after:content-[''] after:absolute after:-top-2 after:-right-2 after:w-12 after:h-12 after:rounded-full after:opacity-15">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-black/45 mb-1">Total Est.</div>
          {loading ? (
             <div className="font-bold text-black/50 text-[11px] animate-pulse py-2">Fetching Live Data...</div>
          ) : (
             <>
               <div className="font-fredoka text-[28px] text-[#0077aa] leading-none">{Math.round(total_ch4)}</div>
               <div className="text-[10px] font-bold text-black/40 mt-1">kt CH₄/yr tracked</div>
             </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="neo-card">
          <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
            <BarChart3 size={20} strokeWidth={2.5} className="text-black" /> CH₄ by Site
          </div>
          <div className="h-64 flex items-center justify-center">
            {loading ? (
              <div className="font-bold text-black/50 animate-pulse">Fetching Satellite Data...</div>
            ) : data.length === 0 ? (
              <div className="font-bold text-black/50">No Data Available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" stroke="#111" tick={{fontFamily: 'Nunito', fontWeight: 800, fontSize: 11}} />
                  <YAxis dataKey="site" type="category" stroke="#111" tick={{fontFamily: 'Nunito', fontWeight: 800, fontSize: 10}} width={100} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#FAFFF0', borderColor: '#111', borderWidth: '3px', borderRadius: '10px', boxShadow: '4px 4px 0 #111', color: '#111', fontWeight: 800 }} />
                  <Bar dataKey="ch4" fill="#FF5FA0" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="neo-card">
          <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
            <MapPin size={20} strokeWidth={2.5} className="text-black" /> Site Details
          </div>
          <div className="flex flex-col gap-[14px]">
            {loading ? (
              <div className="font-bold text-black/50 text-center py-10 animate-pulse">Synchronizing with API...</div>
            ) : data.map(item => {
              const pct = total_ch4 > 0 ? (item.ch4 / total_ch4) * 100 : 0;
              return (
                <div key={item.site} className="flex items-center gap-[8px]">
                  <div className="text-[10px] font-extrabold w-[130px] shrink-0 text-right text-black/65 whitespace-nowrap overflow-hidden text-ellipsis" title={item.site}>{item.site}</div>
                  <div className="flex-1 bg-[#eee] border-[2px] border-black rounded-[6px] h-[20px] overflow-hidden">
                    <div className="h-full flex items-center px-[6px] transition-all bg-lime" style={{ width: `${pct}%` }}>
                      <span className="text-[9px] font-black text-black whitespace-nowrap">{item.ch4.toFixed(1)} kt</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="neo-card bg-lime">
          <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
            <Recycle size={20} strokeWidth={2.5} className="text-black" /> Gas Capture
          </div>
          <p className="text-[12px] font-medium text-black leading-[1.6]">Landfill gas capture can convert CH₄ to electricity. Jawaharnagar alone could power ~30,000 homes.</p>
        </div>
        <div className="neo-card text-black" style={{ backgroundColor: '#FF5FA0' }}>
          <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px] text-black">
            <Archive size={20} strokeWidth={2.5} className="text-black" /> Waste Segregation
          </div>
          <p className="text-[12px] font-medium text-black leading-[1.6]">Wet waste composting reduces methane by up to 70%. Swachh Bharat Phase 2 mandates 100% source segregation.</p>
        </div>
        <div className="neo-card">
          <div className="font-fredoka text-[16px] tracking-[0.3px] mb-[14px] flex items-center gap-[8px]">
            <Pickaxe size={20} strokeWidth={2.5} className="text-black" /> Bio-mining
          </div>
          <p className="text-[12px] font-medium text-black leading-[1.6]">Legacy waste bio-mining recovers land + cuts methane. Ongoing at Ghazipur. Cost: ₹400–600/tonne.</p>
        </div>
      </div>
    </div>
  );
}
