import React from 'react';
import { motion } from 'framer-motion';

const TeamMemberCard = ({ member, onRemove, accentColor }) => {
  if (!member) {
    return (
      <div className="h-24 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">
        <span className="text-sm font-mono">Empty Slot</span>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-fin-card border border-fin-border rounded-lg p-3 flex items-center justify-between group hover:border-slate-500 transition-colors"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div 
          className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center shrink-0"
          style={{ borderColor: `${accentColor}40`, borderWidth: 1 }}
        >
          {member.logo_url ? (
            <img src={member.logo_url} alt={member.ticker} className="w-full h-full object-contain" />
          ) : (
            <span className="font-bold text-sm" style={{ color: accentColor }}>{member.ticker[0]}</span>
          )}
        </div>
        
        <div className="min-w-0">
          <h3 className="font-bold text-sm truncate">{member.ticker}</h3>
          <p className="text-xs text-fin-text-secondary truncate">{member.name}</p>
        </div>
      </div>

      <button 
        onClick={() => onRemove(member.ticker)}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-red-500 rounded transition-all"
        title="Remove from team"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </motion.div>
  );
};

export default TeamMemberCard;
