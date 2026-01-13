import React from 'react';
import { motion } from 'framer-motion';

const formatNumber = (num) => {
  if (!num) return 'N/A';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  return num.toLocaleString();
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
            <span className="text-fin-text-secondary text-xs">{item.label}</span>
            <span className="text-fin-text-primary text-lg font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RawStatsCard;
