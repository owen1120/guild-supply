import { create } from 'zustand';
import { questService, type Quest, type UserQuest } from '../services/questService';

interface QuestState {
  availableQuests: Quest[];
  userQuests: UserQuest[];
  isLoading: boolean;
  error: string | null;

  // 獲取所有任務與個人進度
  fetchQuests: () => Promise<void>;
  
  // 接取任務
  acceptQuest: (questId: string) => Promise<void>;
  
  // 領取獎勵
  claimReward: (questId: string) => Promise<void>;
  
  // 登出時清除紀錄
  clearLocalQuests: () => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  availableQuests: [],
  userQuests: [],
  isLoading: false,
  error: null,

  fetchQuests: async () => {
    set({ isLoading: true, error: null });
    try {
      const [available, personal] = await Promise.all([
        questService.getAvailableQuests(),
        questService.getMyQuests()
      ]);
      set({ availableQuests: available, userQuests: personal });
    } catch (error) {
      console.error('Failed to fetch quests:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to synchronize quest board' });
    } finally {
      set({ isLoading: false });
    }
  },

  acceptQuest: async (questId: string) => {
    set({ isLoading: true, error: null });
    try {
      const newUserQuest = await questService.acceptQuest(questId);
      
      const currentUserQuests = get().userQuests;
      const exists = currentUserQuests.find(uq => uq.questId === questId);
      
      const updatedUserQuests = exists 
        ? currentUserQuests.map(uq => uq.questId === questId ? newUserQuest : uq)
        : [...currentUserQuests, newUserQuest];
        
      set({ userQuests: updatedUserQuests });
    } catch (error) {
      console.error(`Failed to accept quest ${questId}:`, error);
      set({ error: error instanceof Error ? error.message : 'Failed to accept the quest' });
    } finally {
      set({ isLoading: false });
    }
  },

  claimReward: async (questId: string) => {
    set({ isLoading: true, error: null });
    try {
      await questService.claimReward(questId);
      
      const updatedUserQuests = get().userQuests.map(uq => 
        uq.questId === questId ? { ...uq, status: 'CLAIMED' as const } : uq
      );
      
      set({ userQuests: updatedUserQuests });
    } catch (error) {
      console.error(`Failed to claim reward for quest ${questId}:`, error);
      set({ error: error instanceof Error ? error.message : 'Failed to claim reward' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearLocalQuests: () => {
    set({ availableQuests: [], userQuests: [], error: null });
  }
}));