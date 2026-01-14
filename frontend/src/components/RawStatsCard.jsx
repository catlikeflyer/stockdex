import React from 'react';
import { motion } from 'framer-motion';

const formatNumber = (num) => {
  if (!num) return 'N/A';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  return num.toLocaleString();
};

const metricDefinitions = {
  "Market Cap": "Total value of all a company's shares of stock.",
  "P/E Ratio": "Ratio of a company's share price to its earnings per share.",
  "Div Yield": "Annual dividend payments divided by the stock's current price.",
  "52W High": "Highest price at which the stock traded in the last year.",
  "52W Low": "Lowest price at which the stock traded in the last year.",
  "Avg Vol": "Average number of shares traded per day.",
};

const RawStatsCard = ({ stats }) => {
  if (!stats) return null;

  const items = [
    { label: "Market Cap", value: formatNumber(stats.market_cap) },
    { label: "P/E Ratio", value: stats.pe_ratio ? stats.pe_ratio.toFixed(2) : 'N/A' },
    { label: "Div Yield", value: stats.dividend_yield ? (stats.dividend_yield * 100).toFixed(2) + '%' : 'N/A' },
    { label: "52W High", value: stats.fifty_two_week_high ? `$${stats.fifty_two_week_high}` : 'N/A' },
    { label: "52W Low", value: stats.fifty_two_week_low ? `$${stats.fifty_two_week_low}` : 'N/A' },
    { label: "Avg Vol", value: formatNumber(stats.avg_volume) },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-fin-card backdrop-blur-md border border-fin-border rounded-xl p-6 w-full h-full flex flex-col justify-center"
    >
      <h3 className="text-fin-text-secondary text-xs uppercase tracking-wider font-semibold mb-4">Key Metrics</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="group relative w-fit cursor-help">
                <span className="text-fin-text-secondary text-xs border-b border-dotted border-fin-text-secondary/30">{item.label}</span>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                    {metricDefinitions[item.label]}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-700"></div>
                </div>
            </div>
            <span className="text-fin-text-primary text-lg font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RawStatsCard;
