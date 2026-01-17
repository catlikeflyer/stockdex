import React, { useMemo } from 'react';
import TeamMemberCard from './TeamMemberCard';
import StatCard from './StatCard';
import TeamMetricsCard from './TeamMetricsCard';
import { motion } from 'framer-motion';

const TeamView = ({ team, teamStats, onRemove, maxTeamSize = 6 }) => {
  
  // Create a pseudo-object for StatCard to display the team average
  const teamStatData = useMemo(() => {
    if (!teamStats) return null;
    return {
      ticker: "TEAM",
      name: "Your Dream Team",
      category: "Mixed",
      stats: teamStats,
      logo_url: null // Could put a custom team icon here
    };
  }, [teamStats]);

  // Fill empty slots
  const slots = Array(maxTeamSize).fill(null).map((_, i) => team[i] || null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[600px] w-full">
      
      {/* Left: Roster - Spans 4 cols, 2 rows */}
      <div className="md:col-span-4 md:row-span-2 flex flex-col gap-2 h-full overflow-y-auto pr-2">
        <h2 className="text-lg font-bold text-fin-text-primary mb-2 flex items-center justify-between">
          <span>Roster</span>
          <span className="text-sm font-normal text-fin-text-secondary">{team.length} / {maxTeamSize}</span>
        </h2>
        
        <div className="flex flex-col gap-2">
            {slots.map((member, idx) => (
                <TeamMemberCard 
                    key={member ? member.ticker : `empty-${idx}`} 
                    member={member} 
                    onRemove={onRemove}
                    accentColor={member ? (member.current_price > 0 ? '#38bdf8' : '#94a3b8') : '#334155'} // Simplified color logic or pass proper color
                />
            ))}
        </div>
        
        {team.length === 0 && (
            <div className="mt-4 text-sm text-fin-text-secondary text-center italic">
                Search for stocks to add them to your team.
            </div>
        )}
      </div>

      {/* Right: Team Analysis - Spans 8 cols */}
      {/* Split into Radar (Top) and Metrics (Bottom) */}
      <div className="md:col-span-8 md:row-span-2 flex flex-col gap-4 h-full">
         <div className="flex-1 min-h-0">
            {team.length > 0 ? (
                <StatCard 
                    data={teamStatData} 
                    accentColor="#8b5cf6" // Violet for Team
                />
            ) : (
                <div className="h-full w-full bg-fin-card/30 border border-fin-border rounded-xl flex items-center justify-center text-fin-text-secondary">
                    <div className="text-center">
                        <p className="text-xl font-bold mb-2">Build Your Team</p>
                        <p className="text-sm max-w-xs mx-auto">Add at least one stock to see the team analysis.</p>
                    </div>
                </div>
            )}
         </div>
         
         <div className="h-32 shrink-0">
             {team.length > 0 && teamStats && teamStats.raw && (
                 <TeamMetricsCard metrics={teamStats.raw} />
             )}
         </div>
      </div>
    </div>
  );
};

export default TeamView;
