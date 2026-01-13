import React, { useState } from 'react';
import StatCard from './components/StatCard';
import TrendChart from './components/TrendChart';
import RawStatsCard from './components/RawStatsCard';
import SearchBar from './components/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (ticker) => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await fetch(`http://localhost:8000/analyze/${ticker}`);
      if (!response.ok) {
        throw new Error('Stock not found or API error');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.5)]" style={{ backgroundColor: accentColor }}></div>
            <h1 className="text-2xl font-bold tracking-tight">STOCKDEX <span className="text-fin-text-secondary font-light">PRO</span></h1>
         </motion.div>
         
         <div className="w-full md:w-96">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col justify-center">
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-fin-danger font-medium text-center p-4 bg-red-500/5 border border-red-500/20 rounded-lg max-w-md mx-auto"
          >
            {error}
          </motion.div>
        )}

        {!data && !loading && !error && (
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
          {data && (
            <motion.div 
              key={data.ticker}
              // Bento Grid Layout
              className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[600px] w-full"
            >
               {/* Left: Stat Radar - Spans 4 cols, 2 rows (Tall) */}
               <div className="md:col-span-5 md:row-span-2 h-96 md:h-full">
                  <StatCard data={data} accentColor={accentColor} />
               </div>

               {/* Right Top: Trend Chart - Spans 7 cols, 1 row */}
               <div className="md:col-span-7 md:row-span-1 h-64 md:h-full">
                  <TrendChart history={data.history} color={accentColor} />
               </div>

               {/* Right Bottom: Raw Stats - Spans 7 cols, 1 row */}
               <div className="md:col-span-7 md:row-span-1 h-full">
                  <RawStatsCard stats={data.raw_stats} />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
