import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const terms = [
    {
        term: "Value at Risk (VaR)",
        definition: "The maximum amount of money you are likely to lose over a specific time period (e.g., 1 day) with a certain confidence level (e.g., 95%). If VaR is -4%, it means you are 95% confident you won't lose more than 4% in a day."
    },
    {
        term: "Expected Shortfall (CVaR)",
        definition: "Also known as Conditional VaR, this estimates the average loss in scenarios where the loss exceeds the VaR threshold. It tells you 'if things go really bad (worst 5%), how bad is the average loss?'"
    },
    {
        term: "Beta",
        definition: "A measure of a stock's volatility in relation to the overall market. A beta > 1 means the stock is more volatile than the market, while < 1 means it is less volatile."
    },
    {
        term: "P/E Ratio",
        definition: "Price-to-Earnings Ratio. It measures a company's current share price relative to its per-share earnings. A high P/E could mean the stock is overvalued or investors expect high growth."
    },
    {
        term: "Dividend Yield",
        definition: "A financial ratio that shows how much a company pays out in dividends each year relative to its stock price. It is expressed as a percentage."
    },
    {
        term: "Liquidity (Current Ratio)",
        definition: "A liquidity ratio that measures a company's ability to pay short-term obligations or those due within one year. Higher is generally better/safer."
    },
    {
        term: "Profit Margins",
        definition: "The amount by which revenue from sales exceeds costs in a business. It indicates how many cents of profit the company generates for each dollar of sale."
    },
    {
        term: "Debt-to-Equity Ratio",
        definition: "A ratio used to evaluate a company's financial leverage. It is calculated by dividing a company's total liabilities by its shareholder equity. Lower is usually safer."
    }
];

const Glossary = ({ onClose }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-fin-card border border-fin-border rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-fin-border flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Financial Glossary
                        </h2>
                        <p className="text-sm text-fin-text-secondary mt-1">Simple definitions for complex terms</p>
                    </div>
                    <button onClick={onClose} className="text-fin-text-secondary hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {terms.map((item, index) => (
                        <div key={index} className="bg-slate-900/40 p-4 rounded-lg border border-fin-border hover:border-fuchsia-500/30 transition-colors">
                            <h3 className="text-fuchsia-300 font-medium mb-1">{item.term}</h3>
                            <p className="text-fin-text-secondary text-sm leading-relaxed">{item.definition}</p>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-slate-900/80 border-t border-fin-border text-center text-xs text-fin-text-secondary">
                    Use these metrics to understand the health and risk of your investments.
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Glossary;
