import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ data, accentColor = '#38bdf8' }) => {
  if (!data) return null;

  const { stats, category, name, ticker, logo_url } = data;

  const chartData = [
    { subject: 'HP', A: stats.HP, fullMark: 100 },
    { subject: 'Attack', A: stats.Attack, fullMark: 100 },
    { subject: 'Defense', A: stats.Defense, fullMark: 100 },
    { subject: 'Speed', A: stats.Speed, fullMark: 100 },
    { subject: 'Sp. Def', A: stats.SpDef, fullMark: 100 },
    { subject: 'Sp. Atk', A: stats.SpAtk, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-fin-card backdrop-blur-md border border-fin-border rounded-xl p-6 w-full h-full flex flex-col items-center"
    >
      {/* Header */}
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

      {/* Radar Chart */}
      <div className="w-full h-64 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#334155" /> {/* Slate 700 */}
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name={ticker}
              dataKey="A"
              stroke={accentColor}
              strokeWidth={3}
              fill={accentColor}
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>



    </motion.div>
  );
};

export default StatCard;
