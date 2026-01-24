import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const RiskDashboard = ({ ticker, onClose }) => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRiskMetrics = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/risk-metrics/${ticker}`);
                if (!response.ok) throw new Error("Failed to fetch risk metrics");
                const data = await response.json();
                setMetrics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (ticker) fetchRiskMetrics();
    }, [ticker]);

    // Prepare Histogram Data
    const histogramData = useMemo(() => {
        if (!metrics || !metrics.returns) return [];
        
        const returns = metrics.returns;
        const min = Math.min(...returns);
        const max = Math.max(...returns);
        const bins = 40;
        const binSize = (max - min) / bins;
        
        const data = Array(bins).fill(0).map((_, i) => ({
            binStart: min + i * binSize,
            binEnd: min + (i + 1) * binSize,
            count: 0,
            isTail: false
        }));

        returns.forEach(r => {
            const binIndex = Math.min(Math.floor((r - min) / binSize), bins - 1);
            data[binIndex].count++;
        });

        // Mark Tail (Returns < -VaR? Actually VaR is usually a loss. 
        // If VaR is returned as negative number (e.g. -0.02), then returns < VaR are the tail.
        // My backend returns VaR as calculated. If I used `mean + z * std`, and z is neg, VaR is neg.
        // Let's assume VaR is the threshold value (e.g. -0.02).
        return data.map(d => ({
            ...d,
            name: `${(d.binStart * 100).toFixed(1)}%`,
            returnVal: d.binStart + binSize/2,
            isTail: (d.binStart + binSize/2) < metrics.var 
        }));
    }, [metrics]);

    if (!ticker) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div className="bg-fin-card border border-fin-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            Risk Analysis <span className="text-fin-text-secondary text-lg font-normal">/ {ticker}</span>
                        </h2>
                        <p className="text-sm text-fin-text-secondary">Value at Risk (VaR) & Expected Shortfall (CVaR)</p>
                    </div>
                    <button onClick={onClose} className="text-fin-text-secondary hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {loading && <div className="text-center py-20 text-fin-text-secondary animate-pulse">Calculating Risk Metrics...</div>}
                {error && <div className="text-center py-20 text-fin-danger">{error}</div>}

                {metrics && (
                    <div className="space-y-8">
                        {/* Score Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-6 rounded-lg border border-fin-border relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-amber-500/20"></div>
                                <h3 className="text-fin-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Value at Risk (95%)</h3>
                                <div className="text-4xl font-mono font-bold text-amber-400">
                                    {(metrics.var * 100).toFixed(2)}%
                                </div>
                                <p className="text-xs text-fin-text-secondary mt-2">
                                    Max expected loss in 95% of cases. You are unlikely to lose more than this in one day.
                                </p>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-lg border border-fin-border relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-red-500/20"></div>
                                <h3 className="text-fin-text-secondary text-sm font-medium uppercase tracking-wider mb-1">Expected Shortfall (CVaR)</h3>
                                <div className="text-4xl font-mono font-bold text-red-400">
                                    {(metrics.cvar * 100).toFixed(2)}%
                                </div>
                                <p className="text-xs text-fin-text-secondary mt-2">
                                    Average loss in the worst 5% of cases. If things go bad, this is how bad they average.
                                </p>
                            </div>
                        </div>

                        {/* Histogram */}
                        <div className="bg-slate-900/30 p-4 rounded-xl border border-fin-border">
                            <h3 className="text-sm font-medium text-fin-text-secondary mb-4">Daily Returns Distribution (1 Year)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={histogramData} barCategoryGap={1}>
                                        <XAxis 
                                            dataKey="name" 
                                            tick={{fill: '#94a3b8', fontSize: 10}} 
                                            interval={4}
                                            stroke="#334155"
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9'}}
                                            labelStyle={{color: '#94a3b8'}}
                                            formatter={(value, name, props) => [value, "Days"]}
                                            labelFormatter={(l) => `Return: ${l}`}
                                        />
                                        <ReferenceLine x={histogramData.find(d => d.isTail)?.name} stroke="#fbbf24" strokeDasharray="3 3" label={{ position: 'top', value: 'VaR', fill: '#fbbf24', fontSize: 12 }} />
                                        <Bar dataKey="count">
                                            {histogramData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.isTail ? 'rgba(248, 113, 113, 0.6)' : '#334155'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-fin-text-secondary">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
                                    <span>Normal Trading Days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-400/60 rounded-sm"></div>
                                    <span>Extreme Risk Region (Tail)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default RiskDashboard;
