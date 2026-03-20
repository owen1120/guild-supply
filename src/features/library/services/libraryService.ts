// src/features/library/services/libraryService.ts

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface TextBlock {
  type: 'TEXT_BLOCK';
  content: string;
  heading?: string;
}

export interface WarningBlock {
  type: 'WARNING_BLOCK';
  content: string;
}

export interface ImageBlock {
  type: 'IMAGE_BLOCK';
  url: string;
  caption?: string;
}

export interface ChecklistBlock {
  type: 'CHECKLIST_BLOCK';
  items: string[];
}

export type ContentBlock = TextBlock | WarningBlock | ImageBlock | ChecklistBlock;

export interface AuthorInfo {
  name?: string;
  avatarUrl?: string;
  title?: string;
  [key: string]: JsonValue | undefined;
}

export interface RpgMetadata {
  loreRegion?: string;
  readTimeMinutes?: number;
  difficulty?: string;
  [key: string]: JsonValue | undefined;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: string;
  views: number;
  likes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  coverImage?: string | null;
  authorInfo?: AuthorInfo | null;
  contentBody: ContentBlock[]; 
  linkedProducts?: Record<string, JsonValue> | null;
  location?: Record<string, JsonValue> | null;
  rpgMetadata?: RpgMetadata | null;
}

export interface UserBookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
}

export interface ArticleCategory {
  key: string;
  label: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const libraryService = {
  
  async getCategories(): Promise<ArticleCategory[]> {
    const response = await fetch(`${API_URL}/library/categories`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch library categories');
    const result = await response.json();
    return result.data || result;
  },

  async getScrolls(): Promise<Article[]> {
    const response = await fetch(`${API_URL}/library/scrolls`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch library scrolls');
    const result = await response.json();
    return result.data || result;
  },

  async getLatestScrolls(limit: number = 3): Promise<Article[]> {
    const response = await fetch(`${API_URL}/library/scrolls`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch latest scrolls');
    const result = await response.json();
    const scrolls: Article[] = result.data || result;
    
    return scrolls
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  async getScrollById(id: string): Promise<Article> {
    const response = await fetch(`${API_URL}/library/scrolls/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to fetch scroll ${id}`);
    
    const result = await response.json();
    
    // 💎 終極探測雷達：直接把後端回傳的原始包裹印出來！
    console.log('📡 [API 回傳] 原始單一文章資料:', result);
    
    return result.data || result;
  },

  async toggleLike(id: string): Promise<{ success: boolean; likes?: number }> {
    const response = await fetch(`${API_URL}/library/scrolls/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to toggle like for scroll ${id}`);
    return response.json();
  },

  async getBookmarks(): Promise<UserBookmark[]> {
    const response = await fetch(`${API_URL}/guild/bookmarks`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user bookmarks');
    const result = await response.json();
    return result.data || result;
  },

  async addBookmark(articleId: string): Promise<UserBookmark> {
    const response = await fetch(`${API_URL}/guild/bookmarks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ articleId })
    });
    if (!response.ok) throw new Error(`Failed to bookmark scroll ${articleId}`);
    const result = await response.json();
    return result.data || result;
  },

  async removeBookmark(bookmarkId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/guild/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Failed to remove bookmark ${bookmarkId}`);
    return response.json();
  }
};