import React from 'react';
import { motion } from 'framer-motion';

const RiskHeatmap = ({ data }) => {
  if (!data || !data.matrix || !data.tickers) return null;

  const { tickers, matrix } = data;

  // Helper to get color for correlation
  // -1 (Red/Inverse) -> 0 (White/Gray) -> 1 (Blue/Correlated)
  const getColor = (value) => {
    // Clamp
    const v = Math.max(-1, Math.min(1, value));
    
    // Scale for opacity
    if (v >= 0) {
        // 0 to 1 -> Blue
        // 1.0 = Strong Blue, 0.5 = Mid Blue
        const opacity = Math.max(0.1, v);
        return `rgba(56, 189, 248, ${opacity})`; // Sky Blue
    } else {
        // -1 to 0 -> Red
        const opacity = Math.max(0.1, Math.abs(v));
        return `rgba(248, 113, 113, ${opacity})`; // Red
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-fin-card border border-fin-border rounded-xl p-4 w-full h-full flex flex-col"
    >
        <h3 className="text-sm text-fin-text-primary font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-fin-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>
            Correlation Heatmap
        </h3>
        
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center">
             <div className="relative grid" style={{ gridTemplateColumns: `auto repeat(${tickers.length}, minmax(40px, 1fr))` }}>
                 {/* Header Row */}
                 <div className="h-8"></div>
                 {tickers.map(t => (
                     <div key={`head-${t}`} className="h-8 flex items-center justify-center p-1 text-xs font-bold text-fin-text-secondary truncate text-center">
                         {t}
                     </div>
                 ))}

                 {/* Body Rows */}
                 {tickers.map((rowTicker, rIdx) => (
                     <React.Fragment key={`row-${rowTicker}`}>
                         {/* Row Label */}
                         <div className="flex items-center justify-end pr-2 py-1 text-xs font-bold text-fin-text-secondary">
                             {rowTicker}
                         </div>
                         
                         {/* Cells */}
                         {matrix[rIdx].map((cellValue, cIdx) => (
                             <div 
                                key={`cell-${rowTicker}-${tickers[cIdx]}`}
                                className="aspect-square flex items-center justify-center text-[10px] font-mono rounded-sm transition-all hover:ring-1 hover:ring-white z-10 hover:z-20 relative group cursor-default"
                                style={{ backgroundColor: getColor(cellValue) }}
                             >
                                 <span className="opacity-70 group-hover:opacity-100">{cellValue.toFixed(2)}</span>
                                 
                                 {/* Tooltip */}
                                 <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-30 pointer-events-none">
                                     {rowTicker} vs {tickers[cIdx]}: {cellValue.toFixed(2)}
                                 </div>
                             </div>
                         ))}
                     </React.Fragment>
                 ))}
             </div>
             
             {/* Legend */}
             <div className="mt-4 flex gap-4 text-[10px] text-fin-text-secondary">
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-400/80"></div> Corrected (Move together)</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-400/80"></div> Inverse (Hedge)</div>
             </div>
        </div>
    </motion.div>
  );
};

export default RiskHeatmap;
