import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const statDefinitions = {
  'Liquidity': 'Ability to meet short-term obligations.',
  'Growth': 'Rate at which revenue is increasing.',
  'Profitability': 'Efficiency of generating profit from revenue.',
  'Volatility': 'Degree of variation in stock price over time.',
  'Solvency': 'Ability to meet long-term debts and obligations.',
  'Innovation': 'Gross margin proxy; efficiency of production.',
};



const StatCard = ({ data, compareData, accentColor = '#38bdf8', compareColor = '#ffffff' }) => {
  if (!data) return null;

  /* Map legacy keys (from Prod API) to new keys if needed */
  const normalizeStats = (s) => {
      if (!s) return {};
      // If we already have Liquidity, return as is
      if (s.Liquidity !== undefined) return s;

      return {
          Liquidity: s.HP,
          Growth: s.Attack,
          Profitability: s.Defense,
          Volatility: s.Speed,
          Solvency: s.SpDef,
          Innovation: s.SpAtk
      };
  };

  const currentStats = normalizeStats(stats);
  const comparisonStats = compareData ? normalizeStats(compareData.stats) : {};

  /* Ensure values are numbers */
  const cleanStats = (val) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
  };

  const chartData = [
    { subject: 'Liquidity', A: cleanStats(currentStats.Liquidity), B: compareData ? cleanStats(comparisonStats.Liquidity) : 0, fullMark: 100 },
    { subject: 'Growth', A: cleanStats(currentStats.Growth), B: compareData ? cleanStats(comparisonStats.Growth) : 0, fullMark: 100 },
    { subject: 'Profitability', A: cleanStats(currentStats.Profitability), B: compareData ? cleanStats(comparisonStats.Profitability) : 0, fullMark: 100 },
    { subject: 'Volatility', A: cleanStats(currentStats.Volatility), B: compareData ? cleanStats(comparisonStats.Volatility) : 0, fullMark: 100 },
    { subject: 'Solvency', A: cleanStats(currentStats.Solvency), B: compareData ? cleanStats(comparisonStats.Solvency) : 0, fullMark: 100 },
    { subject: 'Innovation', A: cleanStats(currentStats.Innovation), B: compareData ? cleanStats(comparisonStats.Innovation) : 0, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-fin-card backdrop-blur-md border border-fin-border rounded-xl p-6 w-full h-full flex flex-col items-center"
    >
      {/* Header - Only show if NOT in compare mode, or show simplified */}
      {!compareData ? (
          <div className="flex items-center gap-4 mb-6 w-full">
             <div className="w-16 h-16 rounded-xl bg-slate-900 border border-fin-border flex items-center justify-center overflow-hidden shadow-lg p-2"
                  style={{ boxShadow: `0 0 20px -5px ${accentColor}40`, borderColor: `${accentColor}40` }}>
                {logo_url ? (
                    <img src={logo_url} alt={ticker} className="w-full h-full object-contain" />
                ) : (
                    <span className="text-2xl font-bold" style={{ color: accentColor }}>{ticker[0]}</span>
                )}
             </div>
             <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-fin-text-primary truncate">{name}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide"
                          style={{ backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}30`, borderWidth: '1px' }}>
                        {category}
                    </span>
                    <span className="text-fin-text-secondary text-sm font-mono">{ticker}</span>
                </div>
             </div>
          </div>
      ) : (
          <div className="flex justify-center gap-6 mb-4 w-full">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <span className="font-bold">{ticker}</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: compareColor }}></div>
                  <span className="font-bold">{compareData.ticker}</span>
              </div>
          </div>
      )}

      {/* Radar Chart */}
      <div className="w-full h-64 flex-1 min-h-0 flex justify-center items-center">
          <RadarChart width={300} height={250} cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name={ticker}
              dataKey="A"
              stroke={accentColor}
              strokeWidth={3}
              fill={accentColor}
              fillOpacity={0.25}
            />
            {compareData && (
                <Radar
                  name={compareData.ticker}
                  dataKey="B"
                  stroke={compareColor}
                  strokeWidth={3}
                  fill={compareColor}
                  fillOpacity={0.25}
                />
            )}
          </RadarChart>
      </div>

    </motion.div>
  );
};

export default StatCard;
