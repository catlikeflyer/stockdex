import React, { useState, useMemo, useEffect } from 'react';
import StatCard from './components/StatCard';
import TrendChart from './components/TrendChart';
import RawStatsCard from './components/RawStatsCard';
import SearchBar from './components/SearchBar';
import TeamView from './components/TeamView';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [data, setData] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [team, setTeam] = useState([]); // List of stock objects
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [mode, setMode] = useState('single'); // 'single' | 'compare' | 'team'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (ticker) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/analyze/${ticker}`);
      if (!response.ok) {
        throw new Error('Stock not found or API error');
      }
      const result = await response.json();
      
      if (mode === 'compare') {
          // Compare Logic
          if (data) {
             if (result.ticker === data.ticker) throw new Error("Cannot compare same stock");
             setCompareData(result);
          } else {
             setData(result);
          }
      } else if (mode === 'team') {
          // Team Logic
          if (team.length >= 6) throw new Error("Team is full (Max 6)");
          if (team.find(m => m.ticker === result.ticker)) throw new Error("Stock already in team");
          setTeam([...team, result]);
      } else {
          // Single Logic
          setData(result);
          setCompareData(null); 
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromTeam = (ticker) => {
      setTeam(team.filter(t => t.ticker !== ticker));
  };

  // Fetch Risk Analysis when team changes
  useEffect(() => {
    if (team.length < 2) {
        setRiskAnalysis(null);
        return;
    }

    const fetchRisk = async () => {
        try {
            const tickers = team.map(t => t.ticker);
            const response = await fetch('http://127.0.0.1:8000/analyze-team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickers })
            });
            if (response.ok) {
                const result = await response.json();
                if (result.risk_analysis) {
                    setRiskAnalysis(result.risk_analysis);
                }
            }
        } catch (e) {
            console.error("Failed to fetch risk analysis", e);
        }
    };

    // Debounce slightly or just call
    const timeout = setTimeout(fetchRisk, 500);
    return () => clearTimeout(timeout);
  }, [team]);

  // Calculate Team Stats locally for instant feedback
  const teamStats = useMemo(() => {
      if (team.length === 0) return null;
      
      const sums = { Liquidity: 0, Growth: 0, Profitability: 0, Volatility: 0, Solvency: 0, Innovation: 0 };
      let totalPE = 0;
      let totalDiv = 0;
      let peCount = 0;
      let divCount = 0;

      team.forEach(member => {
          // Radar Stats
          Object.keys(sums).forEach(key => {
              sums[key] += (member.stats[key] || 0);
          });

          // Raw Stats
          if (member.raw_stats) {
              const pe = parseFloat(member.raw_stats.pe_ratio);
              if (!isNaN(pe)) {
                  totalPE += pe;
                  peCount++;
              }

              const div = parseFloat(member.raw_stats.dividend_yield); // might be "0.05%" or raw number
              // The API usually returns raw string from yfinance info? Let's assume decimal or check parsing.
              // Actually yfinance info 'dividendYield' is usually a decimal like 0.005 for 0.5%
              // But let's check what our backend returns. The backend just dumps `info.get("dividendYield")`.
              // yfinance returns 0.0056. 
              // Wait, if it is None, we skip.
              if (!isNaN(div)) {
                  totalDiv += div;
                  divCount++;
              }
          }
      });

      const avgs = {};
      Object.keys(sums).forEach(key => {
          avgs[key] = Math.round(sums[key] / team.length);
      });

      // Add computed raw metrics
      avgs.raw = {
          pe_ratio: peCount > 0 ? (totalPE / peCount) : 0,
          dividend_yield: divCount > 0 ? (totalDiv / divCount) : 0 // API returns percentage (e.g. 0.41 for 0.41%), no need to multiply by 100
      };

      return avgs;
  }, [team]);

  const getIndustryColor = (industry) => {
    if (!industry) return '#38bdf8'; // Default Sky
    const lower = industry.toLowerCase();
    
    if (lower.includes('tech') || lower.includes('semicon') || lower.includes('software')) return '#38bdf8'; // Sky (Tech)
    if (lower.includes('bank') || lower.includes('financ') || lower.includes('capital')) return '#34d399'; // Emerald (Money)
    if (lower.includes('health') || lower.includes('pharm') || lower.includes('bio')) return '#f472b6'; // Pink (Health)
    if (lower.includes('energy') || lower.includes('oil') || lower.includes('gas')) return '#fbbf24'; // Amber (Energy)
    if (lower.includes('auto') || lower.includes('transport') || lower.includes('travel')) return '#f87171'; // Red (Transport)
    if (lower.includes('consumer') || lower.includes('retail')) return '#a78bfa'; // Violet (Consumer)
    if (lower.includes('communic') || lower.includes('media')) return '#2dd4bf'; // Teal (Comms)
    
    return '#94a3b8'; // Slate (Default)
  };

  const accentColor = data ? getIndustryColor(data.category) : '#38bdf8';

  return (
    <div className="min-h-screen w-full bg-fin-bg text-fin-text-primary p-4 md:p-8 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 max-w-7xl mx-auto w-full">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-2"
         >
            <div className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.5)]" style={{ backgroundColor: mode === 'team' ? '#8b5cf6' : accentColor }}></div>
            <h1 className="text-2xl font-bold tracking-tight">STOCKDEX <span className="text-fin-text-secondary font-light">PRO</span></h1>
         </motion.div>
         
         <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
             {/* Mode Switcher */}
             <div className="bg-slate-900 p-1 rounded-lg flex border border-fin-border">
                {['single', 'compare', 'team'].map((m) => (
                    <button 
                        key={m}
                        onClick={() => { setMode(m); if(m==='single') setCompareData(null); }}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${mode === m ? 'bg-fin-card shadow-lg text-white' : 'text-fin-text-secondary hover:text-white'}`}
                    >
                        {m}
                    </button>
                ))}
             </div>

             <div className="w-full md:w-96">
                <SearchBar 
                    onSearch={handleSearch} 
                    isLoading={loading} 
                    placeholder={
                        mode === 'compare' && data ? "Add to compare..." : 
                        mode === 'team' ? "Add to team..." : 
                        "Search ticker..."
                    } 
                />
             </div>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col justify-center">
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-fin-danger font-medium text-center p-4 bg-red-500/5 border border-red-500/20 rounded-lg max-w-md mx-auto mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Empty State for Single/Compare */}
        {mode !== 'team' && !data && !loading && !error && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center text-fin-text-secondary mt-20"
            >
                <p className="text-lg">Enter a ticker to verify stock health.</p>
                <div className="flex gap-2 justify-center mt-4">
                    {['AAPL', 'NVDA', 'JPM', 'XOM'].map(t => (
                        <button key={t} onClick={() => handleSearch(t)} className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-sm font-mono">
                            {t}
                        </button>
                    ))}
                </div>
            </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'single' && data && !compareData && (
            <motion.div 
              key="single-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[600px] w-full"
            >
               <div className="md:col-span-5 md:row-span-2 h-96 md:h-full">
                  <StatCard data={data} accentColor={accentColor} />
               </div>
               <div className="md:col-span-7 md:row-span-1 h-64 md:h-full">
                  <TrendChart history={data.history} color={accentColor} />
               </div>
               <div className="md:col-span-7 md:row-span-1 h-full">
                  <RawStatsCard stats={data.raw_stats} />
               </div>
            </motion.div>
          )}

          {mode === 'compare' && data && compareData && (
             <motion.div 
                key="compare-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px] w-full"
             >
                <div className="flex flex-col gap-4 overflow-y-auto">
                    <div className="bg-fin-card p-4 rounded-xl border border-fin-border">
                        <h2 className="text-xl font-bold" style={{ color: accentColor }}>{data.ticker}</h2>
                        <p className="text-sm text-fin-text-secondary">{data.name}</p>
                    </div>
                    <RawStatsCard stats={data.raw_stats} />
                    <div className="h-48">
                        <TrendChart history={data.history} color={accentColor} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <StatCard 
                        data={data} 
                        compareData={compareData} 
                        accentColor={accentColor} 
                        compareColor={getIndustryColor(compareData.category)} 
                    />
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto">
                    <div className="bg-fin-card p-4 rounded-xl border border-fin-border">
                        <h2 className="text-xl font-bold" style={{ color: getIndustryColor(compareData.category) }}>{compareData.ticker}</h2>
                        <p className="text-sm text-fin-text-secondary">{compareData.name}</p>
                    </div>
                    <RawStatsCard stats={compareData.raw_stats} />
                    <div className="h-48">
                        <TrendChart history={compareData.history} color={getIndustryColor(compareData.category)} />
                    </div>
                </div>
             </motion.div>
          )}

          {mode === 'team' && (
              <motion.div
                key="team-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                  <TeamView 
                    team={team} 
                    teamStats={teamStats} 
                    riskAnalysis={riskAnalysis}
                    onRemove={removeFromTeam} 
                  />
              </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
