import axios from 'axios';
import type { Article, LibraryResponse } from '../../../../src/types/library';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const libraryService = {
  getLatestScrolls: async (limit: number = 3): Promise<Article[]> => {
    try {
      const response = await axios.get<LibraryResponse>(`${API_URL}/library/scrolls`);
      
      if (response.data && response.data.success) {
        const sortedArticles = response.data.data.sort((a, b) => {
           return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        });
        
        return sortedArticles.slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch library scrolls:", error);
      return [];
    }
  }
};