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



const CustomTick = ({ payload, x, y, cx, cy, setTooltip, ...rest }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor={(x - cx) > 5 ? "start" : (x - cx) < -5 ? "end" : "middle"}
        dominantBaseline={(y - cy) > 5 ? "hanging" : (y - cy) < -5 ? "auto" : "central"}
        fill="#94a3b8"
        fontSize={10}
        fontWeight={600}
        style={{ cursor: 'help' }}
        onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltip({ 
                text: statDefinitions[payload.value], 
                x: rect.left + rect.width / 2, 
                y: rect.top
            });
        }}
        onMouseLeave={() => setTooltip(null)}
      >
        {payload.value}
      </text>
    </g>
  );
};

const StatCard = ({ data, compareData, accentColor = '#38bdf8', compareColor = '#ffffff' }) => {
  if (!data) return null;

  const [tooltip, setTooltip] = React.useState(null);
  const { stats, category, name, ticker, logo_url } = data;

  /* Ensure values are numbers */
  const cleanStats = (val) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
  };

  const chartData = [
    { subject: 'Liquidity', A: cleanStats(stats.Liquidity), B: compareData ? cleanStats(compareData.stats.Liquidity) : 0, fullMark: 100 },
    { subject: 'Growth', A: cleanStats(stats.Growth), B: compareData ? cleanStats(compareData.stats.Growth) : 0, fullMark: 100 },
    { subject: 'Profitability', A: cleanStats(stats.Profitability), B: compareData ? cleanStats(compareData.stats.Profitability) : 0, fullMark: 100 },
    { subject: 'Volatility', A: cleanStats(stats.Volatility), B: compareData ? cleanStats(compareData.stats.Volatility) : 0, fullMark: 100 },
    { subject: 'Solvency', A: cleanStats(stats.Solvency), B: compareData ? cleanStats(compareData.stats.Solvency) : 0, fullMark: 100 },
    { subject: 'Innovation', A: cleanStats(stats.Innovation), B: compareData ? cleanStats(compareData.stats.Innovation) : 0, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-fin-card backdrop-blur-md border border-fin-border rounded-xl p-6 w-full h-full flex flex-col items-center"
    >
      {/* Tooltip Portal */}
      {tooltip && (
        <div 
            className="fixed z-50 bg-slate-900/90 text-slate-200 text-xs p-2 rounded border border-slate-700 shadow-xl pointer-events-none backdrop-blur-sm max-w-[200px] -translate-x-1/2 -translate-y-full"
            style={{ top: tooltip.y - 8, left: tooltip.x }}
        >
            {tooltip.text}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-700"></div>
        </div>
      )}

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
      <div className="w-full h-64 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#334155" /> {/* Slate 700 */}
            <PolarAngleAxis dataKey="subject" tick={<CustomTick setTooltip={setTooltip} />} />
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
        </ResponsiveContainer>
      </div>

    </motion.div>
  );
};

export default StatCard;
