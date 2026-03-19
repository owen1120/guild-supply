export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type QuestStatus = 'AVAILABLE' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';
export type QuestType = 'MAIN' | 'DAILY' | 'WEEKLY' | 'EVENT';

export interface QuestDisplayInfo {
  title: string;
  iconUrl?: string;
  rpgLore?: string;
  bannerUrl?: string;
  description: string;
  [key: string]: JsonValue | undefined;
}

export interface QuestObjective {
  action: string;
  stepId: number;
  targetType: string;
  description: string;
  targetValue?: string | string[] | null;
  threshold?: number;
  thresholdAmount?: number;
  [key: string]: JsonValue | undefined;
}

export interface QuestReward {
  items?: { id: string; type: string }[];
  badges?: string[];
  guildCoins?: number;
  experiencePoints?: number;
  [key: string]: JsonValue | undefined;
}

export interface QuestConstraints {
  maxRank?: string | null;
  minRank?: string | null;
  timeLimitSeconds?: number | null;
  [key: string]: JsonValue | undefined;
}

export interface Quest {
  id: string;
  type: QuestType;
  displayInfo: QuestDisplayInfo;
  objectives: QuestObjective[];
  rewards: QuestReward;
  constraints: QuestConstraints;
  endDate?: string | null;
}

export interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  status: QuestStatus;
  progress: number;
  acceptedAt?: string;
  completedAt?: string | null;
  progressDetail?: Record<string, JsonValue>; // jsonb
}

export interface ClaimRewardResponse {
  success?: boolean;
  message?: string;
  data?: Record<string, JsonValue> | UserQuest;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const questService = {
  
  // ==========================================
  //  公會佈告欄 API (Guild Board)
  // ==========================================

  async getAvailableQuests(): Promise<Quest[]> {
    const response = await fetch(`${API_URL}/quests`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch available quests');
    const result = await response.json();
    return result.data || result; 
  },

  // ==========================================
  //  個人任務進度 API (Personal Progress)
  // ==========================================

  // 查詢我的任務進度 (GET /guild/quests)
  async getMyQuests(): Promise<UserQuest[]> {
    const response = await fetch(`${API_URL}/guild/quests`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user quests');
    const result = await response.json();
    return result.data || result;
  },

  // 接受任務 (POST /quests/{id}/accept)
  async acceptQuest(questId: string): Promise<UserQuest> {
    const response = await fetch(`${API_URL}/quests/${questId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to accept quest ${questId}`);
    return response.json();
  },

  // 領取任務獎勵 (POST /quests/{id}/claim)
  async claimReward(questId: string): Promise<ClaimRewardResponse> {
    const response = await fetch(`${API_URL}/quests/${questId}/claim`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to claim reward for quest ${questId}`);
    return response.json();
  }

};