import { useState } from "react";

import { AlertTriangle, Search, Home, Tractor, Trash2, Zap, Droplets, Leaf } from "lucide-react";

export default function VillageMode() {
  // Pillars state
  const [crops, setCrops] = useState({ type: "Paddy", area: 100, stubble: 50 });
  const [water, setWater] = useState({ pollution: "High", ch4: 10 }); // ch4 in tonnes/year
  const [electricity, setElectricity] = useState({ usage: 15000 }); // kWh/month for village
  const [transport, setTransport] = useState({ tractors: 20, commercial: 5 });
  const [households, setHouseholds] = useState({ families: 200 });
  const [waste, setWaste] = useState({ dumpSites: 2, composting: 20 });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      // Proxy calculations for annual emissions (kg CO2e)
      // 1. Crops
      const cropsCo2 = crops.area * 1500 * (crops.stubble / 100);
      
      // 2. Water (CH4 GWP = 28)
      const waterCo2 = water.ch4 * 1000 * 28;
      
      // 3. Electricity (Using Tamil Nadu factor: 0.75 kg CO2/kWh)
      const elecCo2 = electricity.usage * 12 * 0.75;
      
      // 4. Transport
      const transportCo2 = transport.tractors * 5000 + transport.commercial * 8000;
      
      // 5. Waste
      const wasteCo2 = waste.dumpSites * 15000 * (1 - waste.composting / 100);

      const totalCo2Yearly = cropsCo2 + waterCo2 + elecCo2 + transportCo2 + wasteCo2;
      
      // Population approx
      const population = households.families * 4.5;
      
      const perCapitaTonnes = totalCo2Yearly / population / 1000;
      
      const isDangerous = perCapitaTonnes > 0.56;

      setResults({
        total: totalCo2Yearly,
        perCapita: perCapitaTonnes,
        isDangerous,
        breakdown: {
          crops: cropsCo2,
          water: waterCo2,
          electricity: elecCo2,
          transport: transportCo2,
          waste: wasteCo2
        }
      });
      setLoading(false);
    }, 800);
  };

  const handleAskVayundhra = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: chatInput,
          type: "village_expert",
          data: {
            crops, water, electricity, transport, households, waste,
            perCapita: results?.perCapita
          }
        })
      });
      const data = await res.json();
      setChatResponse(data.content || data.error || "Sorry, I couldn't process that.");
    } catch (err) {
      setChatResponse("Error connecting to AI advisor.");
    }
    setChatLoading(false);
  };

  const isDanger = results?.isDangerous;

  return (
    <div className={`w-full min-h-full p-4 rounded-xl transition-colors duration-500 ${isDanger ? 'bg-[#FF1E1E] text-white' : 'bg-transparent text-black'}`}>


      {/* Form Container */}
      <div className={`border-[3px] border-black rounded-[16px] p-6 mb-6 shadow-[6px_6px_0_#111] transition-colors ${isDanger ? 'bg-[#2A0808] border-white shadow-[6px_6px_0_#000]' : 'bg-white'}`}>
        <div className={`font-fredoka text-[18px] tracking-[0.3px] mb-[20px] flex items-center gap-[8px] ${isDanger ? 'text-white' : 'text-black'}`}>
          <Home size={22} strokeWidth={2.5} /> Enter Village Demographics & Infrastructure
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Pillar 1: Crops */}
          <div className={`p-4 rounded-xl border-[2px] ${isDanger ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
            <h3 className="flex items-center gap-2 font-bold text-[14px] mb-3"><Leaf size={16} /> Agriculture & Crops</h3>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase opacity-70">Primary Crop Type</label>
              <select className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={crops.type} onChange={e => setCrops({...crops, type: e.target.value})}>
                <option>Paddy</option>
                <option>Wheat</option>
                <option>Sugarcane</option>
              </select>
              <label className="text-[10px] font-extrabold uppercase opacity-70 mt-1">Total Area (Acres)</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={crops.area} onChange={e => setCrops({...crops, area: Number(e.target.value)})} />
              <label className="text-[10px] font-extrabold uppercase opacity-70 mt-1">Stubble Burning (%)</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={crops.stubble} onChange={e => setCrops({...crops, stubble: Number(e.target.value)})} />
            </div>
          </div>

          {/* Pillar 2: Water */}
          <div className={`p-4 rounded-xl border-[2px] ${isDanger ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
            <h3 className="flex items-center gap-2 font-bold text-[14px] mb-3"><Droplets size={16} /> Water Quality</h3>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase opacity-70">Pollution Level</label>
              <select className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={water.pollution} onChange={e => setWater({...water, pollution: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <label className="text-[10px] font-extrabold uppercase opacity-70 mt-1">CH4 from stagnant water (Tons/yr)</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={water.ch4} onChange={e => setWater({...water, ch4: Number(e.target.value)})} />
            </div>
          </div>

          {/* Pillar 3: Electricity */}
          <div className={`p-4 rounded-xl border-[2px] relative overflow-hidden ${isDanger ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
            <div className="absolute top-0 right-0 bg-lime text-black text-[9px] font-black px-2 py-1 rounded-bl-lg">TN GRID = 0.75</div>
            <h3 className="flex items-center gap-2 font-bold text-[14px] mb-3"><Zap size={16} /> Electricity</h3>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase opacity-70">Village Grid Usage (kWh/mo)</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={electricity.usage} onChange={e => setElectricity({...electricity, usage: Number(e.target.value)})} />
            </div>
          </div>

          {/* Pillar 4: Transport */}
          <div className={`p-4 rounded-xl border-[2px] ${isDanger ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
            <h3 className="flex items-center gap-2 font-bold text-[14px] mb-3"><Tractor size={16} /> Transport</h3>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase opacity-70">Active Tractors</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={transport.tractors} onChange={e => setTransport({...transport, tractors: Number(e.target.value)})} />
              <label className="text-[10px] font-extrabold uppercase opacity-70 mt-1">Commercial Vehicles (Trucks/Buses)</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={transport.commercial} onChange={e => setTransport({...transport, commercial: Number(e.target.value)})} />
            </div>
          </div>

          {/* Pillar 5: Households */}
          <div className={`p-4 rounded-xl border-[2px] ${isDanger ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
            <h3 className="flex items-center gap-2 font-bold text-[14px] mb-3"><Home size={16} /> Households</h3>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase opacity-70">Total Families</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={households.families} onChange={e => setHouseholds({...households, families: Number(e.target.value)})} />
            </div>
          </div>

          {/* Pillar 6: Waste */}
          <div className={`p-4 rounded-xl border-[2px] ${isDanger ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
            <h3 className="flex items-center gap-2 font-bold text-[14px] mb-3"><Trash2 size={16} /> Waste Management</h3>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase opacity-70">Open Dump Sites</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={waste.dumpSites} onChange={e => setWaste({...waste, dumpSites: Number(e.target.value)})} />
              <label className="text-[10px] font-extrabold uppercase opacity-70 mt-1">Composting (%)</label>
              <input type="number" className={`p-2 border-[2px] rounded-lg text-sm font-bold outline-none ${isDanger ? 'bg-black text-white border-white/30' : 'bg-white border-black text-black'}`} value={waste.composting} onChange={e => setWaste({...waste, composting: Number(e.target.value)})} />
            </div>
          </div>

        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-bold text-[14px] border-[3px] shadow-[4px_4px_0_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0_#111] active:translate-y-1 active:shadow-[2px_2px_0_#111] transition-all flex items-center gap-2 ${isDanger ? 'bg-white text-black border-black shadow-[4px_4px_0_#000]' : 'bg-lime text-black border-black'}`}
        >
          {loading ? <div className="w-5 h-5 border-[3px] border-black/20 border-t-black rounded-full animate-spin"></div> : <Search size={20} />}
          <span>{loading ? "Calculating..." : "Calculate Village Index"}</span>
        </button>

      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[slideUp_0.3s_ease]">
          
          {/* Risk Dial */}
          <div className={`col-span-1 border-[3px] rounded-[16px] p-6 shadow-[6px_6px_0_#111] flex flex-col items-center justify-center text-center ${isDanger ? 'bg-black border-white shadow-[6px_6px_0_#fff]' : 'bg-white border-black'}`}>
            <h2 className={`font-fredoka text-[20px] mb-4 ${isDanger ? 'text-white' : 'text-black'}`}>Village Risk Dial</h2>
            
            <div className="relative w-[180px] h-[90px] overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-full h-[180px] rounded-full border-[20px] border-[#eee] box-border"></div>
              {/* Dial Fill */}
              <div 
                className={`absolute top-0 left-0 w-full h-[180px] rounded-full border-[20px] border-transparent box-border transition-all duration-1000 ${isDanger ? 'border-t-[#FF1E1E] border-r-[#FF1E1E] border-l-transparent border-b-transparent' : 'border-t-lime border-r-lime border-l-transparent border-b-transparent'}`}
                style={{ transform: `rotate(${Math.min(180, (results.perCapita / 1.0) * 180) - 45}deg)` }}
              ></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-10"></div>
            </div>

            <div className={`font-fredoka text-[48px] leading-none mb-2 ${isDanger ? 'text-[#FF4757]' : 'text-[#3b8a1e]'}`}>
              {results.perCapita.toFixed(2)}
            </div>
            <div className={`text-[12px] font-black uppercase tracking-widest ${isDanger ? 'text-white/70' : 'text-black/50'}`}>
              Tonnes CO₂e per capita
            </div>

            {isDanger ? (
              <div className="mt-6 bg-[#FF1E1E]/20 text-[#FF4757] p-3 rounded-lg border-[2px] border-[#FF4757] font-bold text-[14px] flex items-center gap-2">
                <AlertTriangle size={18} /> HIGH ALERT: Exceeds 0.56 National Avg
              </div>
            ) : (
              <div className="mt-6 bg-lime/20 text-[#3b8a1e] p-3 rounded-lg border-[2px] border-lime font-bold text-[14px] flex items-center gap-2">
                Safe Level (Below 0.56 Avg)
              </div>
            )}
          </div>

          {/* AI Expert Mode */}
          <div className={`col-span-1 lg:col-span-2 border-[3px] rounded-[16px] p-6 shadow-[6px_6px_0_#111] flex flex-col ${isDanger ? 'bg-black border-white shadow-[6px_6px_0_#fff]' : 'bg-black border-black shadow-[6px_6px_0_#111]'}`}>
            <div className="font-fredoka text-[18px] tracking-[0.3px] mb-[14px] flex items-center gap-[10px] text-lime">
              <div className="w-[30px] h-[30px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#a8f0c6,#26C6DA_50%,#0e8fa0)] border-[2px] border-lime shrink-0 relative animate-bobb">
                <div className="absolute top-[5px] left-[7px] w-[8px] h-[5px] bg-white/55 rounded-full -rotate-25"></div>
              </div>
              Vayundhra — Village Expert Mode
            </div>

            <div className="text-[14px] font-semibold text-white/90 leading-[1.65] flex-1">
              <p className="mb-4">I have analyzed your village data. Your primary emission sources are 
                <span className="text-lime"> Transport ({(results.breakdown.transport / 1000).toFixed(1)}t)</span> and 
                <span className="text-lime"> Agriculture ({(results.breakdown.crops / 1000).toFixed(1)}t)</span>.
              </p>
              
              {!showChat ? (
                <button onClick={() => setShowChat(true)} className={`neo-btn font-bold text-[14px] py-2 px-4 shadow-[4px_4px_0_#C8E63C] hover:shadow-[6px_6px_0_#C8E63C] ${isDanger ? 'bg-white text-black border-white' : 'bg-lime text-black border-lime'}`}>
                  Ask for Custom Recommendations
                </button>
              ) : (
                <div className="mt-4 pt-4 border-t border-white/20 flex flex-col gap-3 h-full">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                      placeholder="e.g. How to fix waste? or How to reduce stubble burning?" 
                      className={`flex-1 bg-white/10 border-[2px] p-[10px] rounded-[10px] text-[13px] font-semibold outline-none focus:bg-white/20 transition-colors ${isDanger ? 'border-[#FF4757] text-white placeholder-white/50' : 'border-lime text-lime placeholder-lime/50'}`}
                    />
                    <button 
                      onClick={handleAskVayundhra}
                      disabled={chatLoading || !chatInput.trim()}
                      className={`neo-btn font-bold px-4 shadow-[3px_3px_0_#C8E63C] active:shadow-[1px_1px_0_#C8E63C] disabled:opacity-70 ${isDanger ? 'bg-[#FF4757] text-white border-[#FF4757]' : 'bg-lime text-black border-lime'}`}
                    >
                      {chatLoading ? "..." : "Send"}
                    </button>
                  </div>
                  {chatResponse && (
                    <div className={`p-[14px] rounded-[12px] text-[14px] font-semibold leading-[1.6] ${isDanger ? 'bg-[#FF4757]/20 border-[2px] border-[#FF4757] text-white' : 'bg-lime/10 border-[2px] border-lime text-lime/90'}`}>
                      {chatResponse}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
