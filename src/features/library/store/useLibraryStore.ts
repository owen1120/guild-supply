import { create } from 'zustand';
import { libraryService, type Article, type UserBookmark, type ArticleCategory } from '../services/libraryService';

interface LibraryState {
  scrolls: Article[];
  categories: ArticleCategory[];
  bookmarks: UserBookmark[];
  currentScroll: Article | null;
  
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;

  fetchScrolls: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBookmarks: () => Promise<void>;
  fetchScrollById: (id: string) => Promise<void>;
  
  toggleLike: (articleId: string) => Promise<void>;
  toggleBookmark: (articleId: string) => Promise<void>;
  
  clearCurrentScroll: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  scrolls: [],
  categories: [],
  bookmarks: [],
  currentScroll: null,
  
  isLoading: false,
  isDetailLoading: false,
  error: null,

  fetchScrolls: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await libraryService.getScrolls();
      const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      set({ scrolls: sortedData });
    } catch (error) {
      console.error('Failed to fetch scrolls:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch library scrolls' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const data = await libraryService.getCategories();
      set({ categories: data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchBookmarks: async () => {
    try {
      const data = await libraryService.getBookmarks();
      set({ bookmarks: data });
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
  },

  fetchScrollById: async (id: string) => {
    set({ isDetailLoading: true, error: null });
    try {
      const data = await libraryService.getScrollById(id);
      set({ currentScroll: data });
    } catch (error) {
      console.error(`Failed to fetch scroll ${id}:`, error);
      set({ error: error instanceof Error ? error.message : 'Failed to fetch scroll details' });
    } finally {
      set({ isDetailLoading: false });
    }
  },

  toggleLike: async (articleId: string) => {
    try {
      const result = await libraryService.toggleLike(articleId);
      
      if (result.likes !== undefined) {
        set((state) => ({
          scrolls: state.scrolls.map(s => s.id === articleId ? { ...s, likes: result.likes! } : s),
          currentScroll: state.currentScroll?.id === articleId ? { ...state.currentScroll, likes: result.likes! } : state.currentScroll
        }));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  },

  toggleBookmark: async (articleId: string) => {
    const { bookmarks } = get();
    const existingBookmark = bookmarks.find(b => b.articleId === articleId);

    try {
      if (existingBookmark) {
        await libraryService.removeBookmark(existingBookmark.id);
        set({ bookmarks: bookmarks.filter(b => b.id !== existingBookmark.id) });
      } else {
        const newBookmark = await libraryService.addBookmark(articleId);
        set({ bookmarks: [...bookmarks, newBookmark] });
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  },

  clearCurrentScroll: () => {
    set({ currentScroll: null });
  }
}));