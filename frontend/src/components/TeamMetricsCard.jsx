import React from 'react';
import { motion } from 'framer-motion';

const MetricItem = ({ label, value, type }) => {
    // Determine color based on value and type
    let colorClass = 'text-slate-400';
    let bgColorClass = 'bg-slate-800/50';
    let borderColorClass = 'border-slate-700';

    const numVal = parseFloat(value);

    // Heuristics for color coding
    if (!isNaN(numVal)) {
        if (type === 'pe') {
            // P/E: Lower is generally "safer"/value (Green), Higher is "expensive"/growth (Red/Warn)
            if (numVal < 20) {
                colorClass = 'text-emerald-400';
                bgColorClass = 'bg-emerald-500/10';
                borderColorClass = 'border-emerald-500/20';
            } else if (numVal < 35) {
                colorClass = 'text-amber-400'; // Neutral/Growth
                bgColorClass = 'bg-amber-500/10';
                borderColorClass = 'border-amber-500/20';
            } else {
                colorClass = 'text-red-400'; // High Valuation
                bgColorClass = 'bg-red-500/10';
                borderColorClass = 'border-red-500/20';
            }
        } else if (type === 'div') {
            // Dividend: Higher is better for income (Green)
            if (numVal > 3.0) {
                colorClass = 'text-emerald-400';
                bgColorClass = 'bg-emerald-500/10';
                borderColorClass = 'border-emerald-500/20';
            } else if (numVal > 1.0) {
                colorClass = 'text-amber-400';
                bgColorClass = 'bg-amber-500/10';
                borderColorClass = 'border-amber-500/20';
            } else {
                colorClass = 'text-slate-400'; // Low/No Yield
                bgColorClass = 'bg-slate-800/50';
                borderColorClass = 'border-slate-700';
            }
        }
    }

    return (
        <div className={`flex flex-col p-3 rounded-lg border ${bgColorClass} ${borderColorClass} flex-1`}>
            <span className="text-xs text-fin-text-secondary uppercase tracking-wider font-semibold mb-1">{label}</span>
            <span className={`text-2xl font-bold ${colorClass}`}>
               {isNaN(numVal) ? '-' : (type === 'div' ? `${numVal.toFixed(2)}%` : numVal.toFixed(2))}
            </span>
        </div>
    );
};

const TeamMetricsCard = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-fin-card border border-fin-border rounded-xl p-4 w-full h-full flex flex-col justify-center"
    >
        <h3 className="text-sm text-fin-text-primary font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-fin-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Portfolio Metrics
        </h3>
        <div className="flex gap-4">
            <MetricItem label="Avg P/E Ratio" value={metrics.pe_ratio} type="pe" />
            <MetricItem label="Avg Div. Yield" value={metrics.dividend_yield} type="div" />
        </div>
    </motion.div>
  );
};

export default TeamMetricsCard;
