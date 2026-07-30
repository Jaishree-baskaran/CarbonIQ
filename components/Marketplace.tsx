"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp, TrendingDown, Leaf, Factory, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, ShoppingCart, Calculator,
  TreePine, Sun, Flame, Wind as WindIcon, Droplets, Building2,
  ChevronRight, Star, Shield, Globe, Activity, Target,
  RefreshCw, Info, DollarSign, Package, CircleDot
} from "lucide-react";

type MarketTab = "Overview" | "Calculator" | "Live Market" | "Offset Projects";

interface CreditProject {
  id: number;
  name: string;
  type: string;
  location: string;
  credits: number;
  pricePerCredit: number;
  rating: number;
  verified: boolean;
  icon: any;
  color: string;
  description: string;
}

interface MarketOrder {
  id: number;
  type: "buy" | "sell";
  credits: number;
  price: number;
  company: string;
  time: string;
}

// Sparkline SVG Component (Clean styling)
const Sparkline = ({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4)}`).join(" ");
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} className="w-full">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={height - ((data[data.length - 1] - min) / range) * (height - 4)} r="3" fill={color} />
    </svg>
  );
};

export default function Marketplace() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<MarketTab>("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Base states updated with live metrics
  const [marketPrice, setMarketPrice] = useState(1847);
  const [priceChange, setPriceChange] = useState(3.2);
  const [offsetProjects, setOffsetProjects] = useState<CreditProject[]>([]);
  
  // Calculator states
  const [industry, setIndustry] = useState("manufacturing");
  const [annualEmission, setAnnualEmission] = useState(5000);
  const [reductionTarget, setReductionTarget] = useState(20);
  const [energyType, setEnergyType] = useState("coal");
  
  // Trade Terminal states
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [priceHistory, setPriceHistory] = useState<number[]>([1820, 1835, 1810, 1850, 1840, 1860, 1845, 1870, 1855, 1847]);

  // Fetch real data on mount
  useEffect(() => {
    async function fetchMarketData() {
      try {
        const res = await fetch("/api/marketplace");
        if (!res.ok) throw new Error("Failed to load real market data");
        const json = await res.json();
        if (json.success) {
          setMarketPrice(json.price);
          setPriceChange(json.change);
          
          // Map fetched projects and dynamically link the SVG icons
          const mappedProjects = json.projects.map((p: any) => {
            let iconComponent = TreePine;
            if (p.iconName === "Sun") iconComponent = Sun;
            else if (p.iconName === "Flame") iconComponent = Flame;
            else if (p.iconName === "Wind") iconComponent = WindIcon;
            else if (p.iconName === "Droplets") iconComponent = Droplets;
            else if (p.iconName === "Zap") iconComponent = Zap;

            return {
              ...p,
              icon: iconComponent
            };
          });
          setOffsetProjects(mappedProjects);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load real market data");
      } finally {
        setLoading(false);
      }
    }
    fetchMarketData();
  }, []);
  
  // Disabling active random tickers to stabilize the market price
  useEffect(() => {
    // Price history stays constant relative to baseline loaded metrics
  }, []);

  const tabs: { id: MarketTab; icon: any }[] = [
    { id: "Overview", icon: BarChart3 },
    { id: "Calculator", icon: Calculator },
    { id: "Live Market", icon: Activity },
    { id: "Offset Projects", icon: TreePine },
  ];

  // Market data
  const recentOrders: MarketOrder[] = [
    { id: 1, type: "buy", credits: 500, price: Math.round(marketPrice * 0.99), company: "Tata Steel", time: "2 min ago" },
    { id: 2, type: "sell", credits: 200, price: Math.round(marketPrice * 1.01), company: "Reliance Industries", time: "5 min ago" },
    { id: 3, type: "buy", credits: 1000, price: Math.round(marketPrice * 0.995), company: "Adani Green", time: "8 min ago" },
    { id: 4, type: "sell", credits: 350, price: Math.round(marketPrice * 1.008), company: "JSW Energy", time: "12 min ago" },
    { id: 5, type: "buy", credits: 750, price: Math.round(marketPrice * 0.992), company: "NTPC Ltd", time: "15 min ago" },
    { id: 6, type: "sell", credits: 150, price: Math.round(marketPrice * 1.012), company: "Infosys", time: "18 min ago" },
  ];

  // API Calculator Logic
  const [creditsEarnable, setCreditsEarnable] = useState(0);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  useEffect(() => {
    async function calculateCredits() {
      setLoadingEstimate(true);
      try {
        const isElectricity = energyType === "grid_mix";
        const type = isElectricity ? "electricity" : "fuel_combustion";
        
        const res = await fetch("/api/marketplace/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            amount: annualEmission * (reductionTarget / 100),
            sector: energyType
          })
        });
        const json = await res.json();
        if (json.success) {
          // Convert from CO2 kg to metric tonnes of credits (1 credit = 1 tonne)
          setCreditsEarnable(Math.round(json.co2_kg / 1000));
        }
      } catch (err) {
        // Fallback rule if estimator API route encounters an error
        setCreditsEarnable(Math.round(annualEmission * (reductionTarget / 100) * 0.85));
      } finally {
        setLoadingEstimate(false);
      }
    }
    calculateCredits();
  }, [annualEmission, reductionTarget, energyType, industry]);

  const estimatedRevenue = creditsEarnable * marketPrice;
  const costSavings = Math.round(estimatedRevenue * 0.12);

  return (
    <div className="w-full flex flex-col gap-6 font-nunito max-w-[1200px] mx-auto">
      {loading ? (
        <div className="w-full h-[400px] flex flex-col items-center justify-center bg-white border border-[#E5E7EB] rounded-[32px] p-8 shadow-sm">
          <div className="w-12 h-12 rounded-full border-4 border-[#1B4332]/20 border-t-[#1B4332] animate-spin mb-4" />
          <h3 className="font-fredoka text-[18px] text-[#111]">Loading Live Market Intelligence...</h3>
          <p className="text-[12px] text-gray-400 mt-1">Connecting to global carbon indicators and Gold Standard registry...</p>
        </div>
      ) : error ? (
        <div className="w-full h-[400px] flex flex-col items-center justify-center bg-white border border-red-200 rounded-[32px] p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-500 mb-4 border border-red-200">
            <Info size={24} />
          </div>
          <h3 className="font-fredoka text-[18px] text-[#111]">Market Connection Error</h3>
          <p className="text-[12px] text-red-500 font-bold mt-1">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-gray-100 hover:bg-gray-200 border-[2px] border-black shadow-[3px_3px_0_#111] rounded-xl font-bold text-[13px] transition-all">Retry Connection</button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-[#111] flex items-center gap-3 font-fredoka tracking-wide">
                <div className="w-[42px] h-[42px] rounded-xl bg-[#1B4332] flex items-center justify-center shadow-[3px_3px_0_#111]">
                  <DollarSign size={22} className="text-[#C8E63C]" />
                </div>
                Carbon Credit Marketplace
              </h1>
              <p className="text-[14px] text-gray-500 font-medium mt-1.5 ml-[54px]">
                India's Carbon Credit Trading Scheme (CCTS) • Bureau of Energy Efficiency
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border-[2px] border-black rounded-xl px-4 py-2 shadow-[3px_3px_0_#111]">
                <CircleDot size={14} className="text-green-500 animate-pulse" />
                <span className="text-[12px] font-black text-black uppercase tracking-wider">Market Open</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-2 flex overflow-x-auto hide-scrollbar gap-2 sticky top-4 z-30">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[13px] whitespace-nowrap transition-all w-[180px] ${
                  activeTab === t.id
                    ? "bg-[#1B4332] text-white shadow-md"
                    : "text-[#6B7280] hover:bg-[#F3F4F6]"
                }`}
              >
                <t.icon size={16} strokeWidth={activeTab === t.id ? 2.5 : 2} />
                {t.id}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="w-full min-h-[600px] mb-12">

            {/* === OVERVIEW TAB === */}
            {activeTab === "Overview" && (
              <div className="animate-[fadeIn_0.3s_ease] flex flex-col gap-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Current Price", value: `₹${marketPrice.toFixed(0)}`, sub: "per tonne CO₂e", change: priceChange, icon: TrendingUp, color: "#1B4332" },
                    { label: "24h Volume", value: "12,847", sub: "credits traded", change: 8.5, icon: Activity, color: "#2F6891" },
                    { label: "Total Listed", value: "37,800", sub: "credits available", change: -2.1, icon: Package, color: "#C26B24" },
                    { label: "Avg. Rating", value: "4.7★", sub: "across 48 projects", change: 0.3, icon: Star, color: "#9B59B6" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + "18" }}>
                          <stat.icon size={16} style={{ color: stat.color }} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <div className="text-[26px] font-extrabold text-[#111] font-fredoka">{stat.value}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-gray-400 font-medium">{stat.sub}</span>
                        <span className={`text-[11px] font-bold flex items-center gap-0.5 ${stat.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {stat.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {Math.abs(stat.change).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Chart + Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-fredoka text-[18px] text-[#111]">Price Trend (Live)</h3>
                      <div className={`flex items-center gap-1 text-[14px] font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {priceChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        ₹{marketPrice.toFixed(0)} ({priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="h-[160px] flex items-end">
                      <Sparkline data={priceHistory} color={priceChange >= 0 ? "#2ECC71" : "#FF4757"} height={140} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-2">
                      <span>30 sec ago</span>
                      <span>Now</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-4">
                    {/* Quick Trade */}
                    <div className="bg-[#1B4332] rounded-[24px] p-6 text-white flex-1">
                      <h3 className="font-fredoka text-[16px] mb-4 flex items-center gap-2">
                        <ShoppingCart size={18} /> Quick Trade
                      </h3>
                      <div className="flex gap-2 mb-4">
                        <button onClick={() => setTradeType("buy")} className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all ${tradeType === "buy" ? "bg-[#2ECC71] text-black" : "bg-white/10 text-white/70"}`}>Buy</button>
                        <button onClick={() => setTradeType("sell")} className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all ${tradeType === "sell" ? "bg-[#FF4757] text-white" : "bg-white/10 text-white/70"}`}>Sell</button>
                      </div>
                      <div className="mb-3">
                        <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Credits</label>
                        <input type="number" value={tradeAmount} onChange={e => setTradeAmount(Number(e.target.value))} className="w-full mt-1 py-2 px-3 rounded-lg bg-white/10 text-white font-bold text-[14px] outline-none focus:bg-white/20 transition-all border border-white/10" />
                      </div>
                      <div className="flex justify-between text-[12px] text-white/60 mb-4">
                        <span>Total Cost</span>
                        <span className="font-bold text-white">₹{(tradeAmount * marketPrice).toLocaleString("en-IN")}</span>
                      </div>
                      <button className={`w-full py-3 rounded-xl font-bold text-[14px] transition-all ${tradeType === "buy" ? "bg-[#2ECC71] hover:bg-[#27AE60] text-black" : "bg-[#FF4757] hover:bg-[#E84141] text-white"} border-[2px] border-black shadow-[3px_3px_0_rgba(0,0,0,0.3)]`}>
                        {tradeType === "buy" ? "Buy" : "Sell"} {tradeAmount} Credits
                      </button>
                    </div>

                    {/* India CCTS Badge */}
                    <div className="bg-gradient-to-br from-[#FDE047] to-[#F59E0B] rounded-[24px] p-5 border-[2px] border-black shadow-[4px_4px_0_#111]">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield size={16} className="text-black" />
                        <span className="font-fredoka text-[14px] text-black">India CCTS Compliant</span>
                      </div>
                      <p className="text-[11px] text-black/70 font-medium leading-relaxed">
                        All trades comply with the Carbon Credit Trading Scheme under the Energy Conservation Act 2022.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                  <h3 className="font-fredoka text-[18px] text-[#111] mb-4 flex items-center gap-2">
                    <RefreshCw size={16} className="text-gray-400" /> Recent Market Activity
                  </h3>
                  <div className="space-y-2">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#F9FAFB] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-[8px] h-[8px] rounded-full ${order.type === "buy" ? "bg-green-500" : "bg-red-500"}`} />
                          <span className="font-bold text-[13px] text-[#111] w-[140px]">{order.company}</span>
                          <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded ${order.type === "buy" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                            {order.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-[13px] font-bold text-[#111]">{order.credits.toLocaleString()} credits</span>
                          <span className="text-[13px] text-gray-500">₹{order.price.toLocaleString()}/t</span>
                          <span className="text-[11px] text-gray-400 w-[80px] text-right">{order.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === CALCULATOR TAB === */}
            {activeTab === "Calculator" && (
              <div className="animate-[fadeIn_0.3s_ease] flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  
                  {/* Input Form */}
                  <div className="md:col-span-3 bg-white rounded-[24px] p-8 border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                    <h3 className="font-fredoka text-[20px] text-[#111] mb-6 flex items-center gap-2">
                      <Calculator size={20} className="text-[#1B4332]" /> Credit Estimation Calculator
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-extrabold text-black/50 uppercase tracking-wide block mb-1.5">Industry Sector</label>
                        <select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full py-2.5 px-3 border-[2px] border-black rounded-xl text-[13px] font-bold bg-white outline-none focus:shadow-[2px_2px_0_#111] transition-all">
                          <option value="manufacturing">Manufacturing</option>
                          <option value="it_services">IT & Services</option>
                          <option value="logistics">Logistics & Transport</option>
                          <option value="construction">Construction</option>
                          <option value="agriculture">Agriculture</option>
                          <option value="textiles">Textiles</option>
                          <option value="chemicals">Chemicals</option>
                          <option value="mining">Mining</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-extrabold text-black/50 uppercase tracking-wide block mb-1.5">Primary Energy Source</label>
                        <select value={energyType} onChange={e => setEnergyType(e.target.value)} className="w-full py-2.5 px-3 border-[2px] border-black rounded-xl text-[13px] font-bold bg-white outline-none focus:shadow-[2px_2px_0_#111] transition-all">
                          <option value="coal">Coal</option>
                          <option value="natural_gas">Natural Gas</option>
                          <option value="diesel">Diesel</option>
                          <option value="grid_mix">Grid Mix</option>
                          <option value="solar_hybrid">Solar Hybrid</option>
                          <option value="wind_hybrid">Wind Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-black/50 uppercase tracking-wide block mb-1.5">Annual Emissions (tCO₂e)</label>
                        <input type="number" value={annualEmission} onChange={e => setAnnualEmission(Number(e.target.value))} className="w-full py-2.5 px-3 border-[2px] border-black rounded-xl text-[13px] font-bold outline-none focus:shadow-[2px_2px_0_#111] transition-all" />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-black/50 uppercase tracking-wide block mb-1.5">Reduction Target (%)</label>
                        <input type="range" min="5" max="80" value={reductionTarget} onChange={e => setReductionTarget(Number(e.target.value))} className="w-full mt-2 accent-[#1B4332]" />
                        <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-1">
                          <span>5%</span>
                          <span className="text-[#1B4332] font-extrabold text-[14px]">{reductionTarget}%</span>
                          <span>80%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="md:col-span-2 flex flex-col gap-4">
                    <div className="bg-[#1B4332] rounded-[24px] p-6 text-white flex-1">
                      <h3 className="font-fredoka text-[16px] mb-5 text-[#C8E63C]">Estimated Earnings</h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Credits Earnable</span>
                          <div className="text-[32px] font-extrabold font-fredoka text-white">{creditsEarnable.toLocaleString("en-IN")}</div>
                          <span className="text-[11px] text-white/50">carbon credits per year</span>
                        </div>
                        <div className="h-[1px] bg-white/10" />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Estimated Revenue</span>
                          <div className="text-[28px] font-extrabold font-fredoka text-[#2ECC71]">₹{(estimatedRevenue / 100000).toFixed(1)}L</div>
                          <span className="text-[11px] text-white/50">at current market price ₹{marketPrice.toFixed(0)}/credit</span>
                        </div>
                        <div className="h-[1px] bg-white/10" />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Additional Savings</span>
                          <div className="text-[22px] font-extrabold font-fredoka text-[#FDE047]">₹{(costSavings / 100000).toFixed(1)}L</div>
                          <span className="text-[11px] text-white/50">from energy efficiency improvements</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-5 border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                      <div className="flex items-start gap-3">
                        <Info size={16} className="text-[#3498DB] mt-0.5 shrink-0" />
                        <p className="text-[12px] text-gray-600 leading-relaxed">
                          <strong>PAT Scheme:</strong> Industries exceeding their Specific Energy Consumption (SEC) target under BEE's PAT scheme earn tradeable Energy Saving Certificates (ESCerts), convertible to carbon credits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === LIVE MARKET TAB === */}
            {activeTab === "Live Market" && (
              <div className="animate-[fadeIn_0.3s_ease] flex flex-col gap-6">
                
                {/* Live Ticker */}
                <div className="bg-[#111] rounded-[24px] p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <CircleDot size={12} className="text-green-400 animate-pulse" />
                      <span className="font-fredoka text-[14px] text-white/70">INDIAN CARBON MARKET • LIVE</span>
                    </div>
                    <span className="text-[11px] text-white/40">{new Date().toLocaleTimeString("en-IN")}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[
                      { label: "CER", price: marketPrice, change: priceChange },
                      { label: "VER", price: marketPrice * 0.72, change: priceChange * 0.8 },
                      { label: "REC", price: 1250, change: 1.4 },
                      { label: "ESCert", price: 1080, change: -0.9 },
                      { label: "PAT", price: 990, change: 2.3 },
                      { label: "CBL (Intl)", price: 2450, change: -1.2 },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3">
                        <div className="text-[10px] text-white/40 font-bold uppercase">{item.label}</div>
                        <div className="text-[18px] font-extrabold font-fredoka mt-1">₹{item.price.toFixed(0)}</div>
                        <span className={`text-[11px] font-bold ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Book + Trade */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Buy Orders */}
                  <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB]">
                    <h3 className="font-fredoka text-[16px] text-[#111] mb-4 flex items-center gap-2">
                      <ArrowUpRight size={16} className="text-green-600" /> Buy Orders
                    </h3>
                    <div className="space-y-2">
                      {[
                        { price: marketPrice - 10, qty: 450 },
                        { price: marketPrice - 25, qty: 800 },
                        { price: marketPrice - 40, qty: 1200 },
                        { price: marketPrice - 55, qty: 650 },
                        { price: marketPrice - 70, qty: 920 },
                      ].map((o, i) => (
                        <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-green-50/50">
                          <span className="text-[13px] font-bold text-green-700">₹{o.price.toFixed(0)}</span>
                          <div className="flex-1 mx-3 h-[6px] bg-green-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 rounded-full" style={{ width: `${(o.qty / 1200) * 100}%` }} />
                          </div>
                          <span className="text-[12px] font-bold text-gray-600 w-[60px] text-right">{o.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sell Orders */}
                  <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB]">
                    <h3 className="font-fredoka text-[16px] text-[#111] mb-4 flex items-center gap-2">
                      <ArrowDownRight size={16} className="text-red-500" /> Sell Orders
                    </h3>
                    <div className="space-y-2">
                      {[
                        { price: marketPrice + 8, qty: 320 },
                        { price: marketPrice + 20, qty: 550 },
                        { price: marketPrice + 35, qty: 980 },
                        { price: marketPrice + 50, qty: 400 },
                        { price: marketPrice + 65, qty: 700 },
                      ].map((o, i) => (
                        <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-red-50/50">
                          <span className="text-[13px] font-bold text-red-600">₹{o.price.toFixed(0)}</span>
                          <div className="flex-1 mx-3 h-[6px] bg-red-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-400 rounded-full" style={{ width: `${(o.qty / 980) * 100}%` }} />
                          </div>
                          <span className="text-[12px] font-bold text-gray-600 w-[60px] text-right">{o.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Place Order */}
                  <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB]">
                    <h3 className="font-fredoka text-[16px] text-[#111] mb-4">Place Order</h3>
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => setTradeType("buy")} className={`flex-1 py-2 rounded-lg font-bold text-[13px] border-[2px] transition-all ${tradeType === "buy" ? "bg-green-500 text-white border-green-600" : "bg-white text-gray-500 border-gray-200"}`}>Buy</button>
                      <button onClick={() => setTradeType("sell")} className={`flex-1 py-2 rounded-lg font-bold text-[13px] border-[2px] transition-all ${tradeType === "sell" ? "bg-red-500 text-white border-red-600" : "bg-white text-gray-500 border-gray-200"}`}>Sell</button>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="text-[10px] font-extrabold text-black/50 uppercase tracking-wide block mb-1">Quantity</label>
                        <input type="number" value={tradeAmount} onChange={e => setTradeAmount(Number(e.target.value))} className="w-full py-2 px-3 border-[2px] border-black rounded-lg text-[13px] font-bold outline-none focus:shadow-[2px_2px_0_#111] transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-black/50 uppercase tracking-wide block mb-1">Price (₹/credit)</label>
                        <input type="number" value={marketPrice.toFixed(0)} className="w-full py-2.5 px-3 border-[2px] border-gray-300 rounded-lg text-[13px] font-bold bg-gray-50 text-gray-500 outline-none" readOnly />
                      </div>
                    </div>
                    <div className="bg-[#F9FAFB] rounded-xl p-3 mb-4 text-[12px]">
                      <div className="flex justify-between mb-1"><span className="text-gray-500">Subtotal</span><span className="font-bold">₹{(tradeAmount * marketPrice).toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between mb-1"><span className="text-gray-500">Platform Fee (0.5%)</span><span className="font-bold">₹{(tradeAmount * marketPrice * 0.005).toLocaleString("en-IN")}</span></div>
                      <div className="h-[1px] bg-gray-200 my-2" />
                      <div className="flex justify-between"><span className="font-bold text-[#111]">Total</span><span className="font-extrabold text-[#111]">₹{(tradeAmount * marketPrice * 1.005).toLocaleString("en-IN")}</span></div>
                    </div>
                    <button className={`w-full py-3 rounded-xl font-bold text-[14px] border-[2px] border-black shadow-[3px_3px_0_#111] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#111] ${tradeType === "buy" ? "bg-[#2ECC71] hover:bg-[#27AE60] text-black" : "bg-[#FF4757] hover:bg-[#E84141] text-white"}`}>
                      Confirm {tradeType === "buy" ? "Purchase" : "Sale"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* === OFFSET PROJECTS TAB === */}
            {activeTab === "Offset Projects" && (
              <div className="animate-[fadeIn_0.3s_ease] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-fredoka text-[20px] text-[#111] flex items-center gap-2">
                    <Globe size={20} className="text-[#1B4332]" /> Verified Offset Projects in India
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                    <Shield size={14} className="text-green-600" /> All projects are Gold Standard / VCS verified
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {offsetProjects.map(project => (
                    <div key={project.id} className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[44px] h-[44px] rounded-xl flex items-center justify-center border-[2px] border-black shadow-[2px_2px_0_#111]" style={{ backgroundColor: project.color + "20" }}>
                            <project.icon size={22} style={{ color: project.color }} />
                          </div>
                          <div>
                            <h4 className="font-bold text-[14px] text-[#111] leading-tight">{project.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">{project.type}</span>
                              <span className="text-[10px] text-gray-300">•</span>
                              <span className="text-[10px] font-bold text-gray-400">{project.location}</span>
                            </div>
                          </div>
                        </div>
                        {project.verified && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                            <Shield size={10} /> Verified
                          </div>
                        )}
                      </div>
                      
                      <p className="text-[12px] text-gray-500 leading-relaxed mb-4">{project.description}</p>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-[#F9FAFB] rounded-xl p-3 text-center">
                          <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Credits</div>
                          <div className="text-[16px] font-extrabold text-[#111] font-fredoka">{(project.credits / 1000).toFixed(1)}K</div>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-xl p-3 text-center">
                          <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Price</div>
                          <div className="text-[16px] font-extrabold text-[#111] font-fredoka">₹{project.pricePerCredit.toLocaleString()}</div>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-xl p-3 text-center">
                          <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Rating</div>
                          <div className="text-[16px] font-extrabold text-[#111] font-fredoka">{project.rating}★</div>
                        </div>
                      </div>

                      <button className="w-full py-2.5 bg-[#1B4332] hover:bg-[#14532D] text-white font-bold rounded-xl text-[13px] transition-all flex items-center justify-center gap-2 border-[2px] border-black shadow-[3px_3px_0_#111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#111]">
                        Invest in Project <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
