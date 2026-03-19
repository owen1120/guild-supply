import { useState, useEffect } from 'react';
import { 
  ScrollText, Star, Calendar, CalendarDays, Zap, 
  CheckCircle2, Clock, Gift, Coins, Trophy, Loader2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useQuestStore } from '../features/quests/store/useQuestStore';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';
import type { QuestType } from '../features/quests/services/questService';

const TABS: { id: 'ALL' | QuestType; label: string; icon: LucideIcon; color: string }[] = [
  { id: 'ALL', label: 'All Quests', icon: ScrollText, color: 'text-slate-500' },
  { id: 'MAIN', label: 'Main Story', icon: Star, color: 'text-indigo-500' },
  { id: 'DAILY', label: 'Daily', icon: Calendar, color: 'text-green-500' },
  { id: 'WEEKLY', label: 'Weekly', icon: CalendarDays, color: 'text-blue-500' },
  { id: 'EVENT', label: 'Events', icon: Zap, color: 'text-amber-500' },
];

export default function Quest() {
  const { availableQuests, userQuests, isLoading, fetchQuests, acceptQuest, claimReward } = useQuestStore();
  const [activeTab, setActiveTab] = useState<'ALL' | QuestType>('ALL');

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const processedQuests = availableQuests.map(quest => {
    const personalProgress = userQuests.find(uq => uq.questId === quest.id);
    return {
      ...quest,
      currentStatus: personalProgress?.status || 'AVAILABLE',
      progressData: personalProgress
    };
  });

  const filteredQuests = processedQuests.filter(q => activeTab === 'ALL' || q.type === activeTab);

  if (isLoading && availableQuests.length === 0) {
    return (
      <div className="flex flex-col h-full w-full min-h-0 px-[clamp(16px,2vw,32px)] pb-[clamp(16px,2vh,32px)]">
        <div className="flex items-center gap-3 mb-8 pt-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-48 h-10" />
        </div>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-24 h-10 rounded-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-12">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-full h-80 rounded-4xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0 px-[clamp(16px,2vw,32px)] pb-[clamp(16px,2vh,32px)] overflow-hidden animate-in fade-in duration-500">
      
      <div className="shrink-0 pt-[clamp(8px,1vh,16px)] mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
            <ScrollText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-widest uppercase">Guild Board</h1>
            <p className="font-mono text-sm text-slate-500 mt-1">Accept commissions, earn standing, and claim your rewards.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar pb-2 shrink-0">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm font-bold transition-all border whitespace-nowrap",
                isActive 
                  ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-cyan-400" : tab.color)} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {filteredQuests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-200/50 border-dashed">
          <ScrollText className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-serif font-bold text-slate-600 mb-2">No Commissions Available</h2>
          <p className="font-mono text-sm text-slate-400">The board is currently clear for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-12 auto-rows-max">
          {filteredQuests.map(quest => {
            const { displayInfo, rewards, currentStatus } = quest;
            
            const configMap = {
              AVAILABLE: { label: 'Accept Quest', style: 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/30 shadow-lg', icon: ScrollText, action: () => acceptQuest(quest.id) },
              ACCEPTED: { label: 'In Progress', style: 'bg-slate-100 text-slate-400 cursor-not-allowed', icon: Clock, action: null },
              IN_PROGRESS: { label: 'In Progress', style: 'bg-slate-100 text-slate-400 cursor-not-allowed', icon: Clock, action: null },
              COMPLETED: { label: 'Claim Reward', style: 'bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-amber-500/40 shadow-xl animate-pulse hover:animate-none', icon: Gift, action: () => claimReward(quest.id) },
              CLAIMED: { label: 'Completed', style: 'bg-green-50 text-green-600 border border-green-200 cursor-default', icon: CheckCircle2, action: null },
            };
            const validStatus = (currentStatus in configMap) ? currentStatus as keyof typeof configMap : 'AVAILABLE';
            const statusConfig = configMap[validStatus];

            const TypeIcon = TABS.find(t => t.id === quest.type)?.icon || Star;
            const typeColor = TABS.find(t => t.id === quest.type)?.color;

            return (
              <div key={quest.id} className="glass-panel min-h-80 rounded-4xl border border-white/60 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden relative group">
                
                <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-br from-slate-100 to-slate-50 opacity-50 z-0" />
                {displayInfo.bannerUrl && (
                  <div 
                    className="absolute top-0 left-0 w-full h-32 bg-cover bg-center opacity-20 z-0 mix-blend-multiply" 
                    style={{ backgroundImage: `url(${displayInfo.bannerUrl})` }} 
                  />
                )}

                <div className="p-6 sm:p-8 relative z-10 flex flex-col flex-1">
                  
                  <div className="flex gap-4 items-start mb-6 shrink-0">
                    <div className="w-16 h-16 shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-2 overflow-hidden">
                      {displayInfo.iconUrl ? (
                        <img 
                          src={displayInfo.iconUrl} 
                          alt="icon" 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100/f8fafc/64748b?text=Q';
                          }}
                        />
                      ) : (
                        <TypeIcon className={cn("w-8 h-8", typeColor)} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider", typeColor, "border-current/20 bg-current/5")}>
                          {quest.type}
                        </span>
                      </div>
                      <h3 className="text-xl leading-tight font-serif font-bold text-slate-900">{displayInfo.title}</h3>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <p className="text-sm text-slate-700 font-medium mb-3 line-clamp-3">{displayInfo.description}</p>
                    {displayInfo.rpgLore && (
                      <p className="text-xs font-mono text-slate-500 italic line-clamp-2 border-l-2 border-slate-200 pl-3">
                        "{displayInfo.rpgLore}"
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-5">
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100/80">
                      {rewards.guildCoins ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-xs font-mono font-bold text-amber-600 shadow-sm border border-slate-100">
                          <Coins className="w-4 h-4" /> {rewards.guildCoins} Gold
                        </div>
                      ) : null}
                      {rewards.experiencePoints ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-xs font-mono font-bold text-indigo-600 shadow-sm border border-slate-100">
                          <Trophy className="w-4 h-4" /> {rewards.experiencePoints} EXP
                        </div>
                      ) : null}
                      {rewards.badges?.map((_, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-xl text-xs font-mono font-bold text-cyan-400 shadow-sm">
                          <Star className="w-3 h-3" /> Badge
                        </div>
                      ))}
                      {rewards.items?.length ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-xs font-mono font-bold text-emerald-600 shadow-sm border border-slate-100">
                          <Gift className="w-4 h-4" /> Item Reward
                        </div>
                      ) : null}
                    </div>

                    <button 
                      onClick={statusConfig.action || undefined}
                      disabled={!statusConfig.action || isLoading}
                      className={cn(
                        "w-full py-4 rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:active:scale-100 disabled:opacity-80 shrink-0",
                        statusConfig.style
                      )}
                    >
                      {isLoading && statusConfig.action ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <statusConfig.icon className="w-5 h-5" />
                          {statusConfig.label}
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}