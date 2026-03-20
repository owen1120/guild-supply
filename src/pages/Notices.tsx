// src/pages/Notices.tsx
import { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Eye, Heart, Bookmark, 
  Library, Flame, Sparkles
} from 'lucide-react';
import { useLibraryStore } from '../features/library/store/useLibraryStore';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';
import ScrollDrawer from '../features/library/components/ScrollDrawer';

export default function Notices() {
  const { 
    scrolls, 
    categories, 
    bookmarks, 
    isLoading, 
    fetchScrolls, 
    fetchCategories, 
    fetchBookmarks,
    toggleBookmark
  } = useLibraryStore();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedScrollId, setSelectedScrollId] = useState<string | null>(null);

  useEffect(() => {
    fetchScrolls();
    fetchCategories();
    fetchBookmarks();
  }, [fetchScrolls, fetchCategories, fetchBookmarks]);

  const filteredScrolls = scrolls.filter(
    scroll => activeCategory === 'ALL' || scroll.category === activeCategory
  );

  if (isLoading && scrolls.length === 0) {
    return (
      <div className="flex flex-col h-full w-full min-h-0 px-[clamp(16px,2vw,32px)] pb-[clamp(16px,2vh,32px)]">
        <div className="flex items-center gap-3 mb-8 pt-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-24 h-10 rounded-full" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-12">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="w-full h-96 rounded-4xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0 px-[clamp(16px,2vw,32px)] pb-[clamp(16px,2vh,32px)] overflow-hidden animate-in fade-in duration-500 relative">
      
      {/* 標題區 */}
      <div className="shrink-0 pt-[clamp(8px,1vh,16px)] mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-200/50 rounded-full blur-xl" />
            <Library className="w-7 h-7 text-emerald-600 relative z-10" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-widest uppercase flex items-center gap-3">
              Guild Archives
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </h1>
            <p className="font-mono text-sm text-slate-500 mt-1">Chronicles, patch notes, and survival guides for pathfinders.</p>
          </div>
        </div>
      </div>

      {/* 分類頁籤區 */}
      <div className="flex gap-2 mb-8 overflow-x-auto custom-scrollbar pb-2 shrink-0">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-full font-mono text-sm font-bold transition-all border whitespace-nowrap",
            activeCategory === 'ALL'
              ? "bg-slate-900 text-white border-slate-900 shadow-md" 
              : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50"
          )}
        >
          <BookOpen className={cn("w-4 h-4", activeCategory === 'ALL' ? "text-emerald-400" : "text-slate-400")} />
          All Scrolls
        </button>
        
        {/* 動態渲染分類頁籤：完美相容純字串與物件，且無任何 any */}
        {categories.map((categoryItem, index) => {
          const isString = typeof categoryItem === 'string';
          
          // 透過 unknown 中介進行安全型別轉換
          const catRecord = isString ? null : (categoryItem as unknown as Record<string, string>);
          
          const catKey = isString ? categoryItem : (catRecord?.key || `cat-${index}`);
          const catLabel = isString ? categoryItem : (catRecord?.label || String(categoryItem));

          return (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full font-mono text-sm font-bold transition-all border whitespace-nowrap",
                activeCategory === catKey
                  ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50"
              )}
            >
              {/* 將底線取代為空白，讓純大寫的字串看起來更像標籤 */}
              {catLabel.replace(/_/g, ' ')}
            </button>
          );
        })}
      </div>

      {/* 文章列表區 */}
      {filteredScrolls.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-4xl border border-slate-200/50 border-dashed">
          <Library className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-xl font-serif font-bold text-slate-600 mb-2">No Archives Found</h2>
          <p className="font-mono text-sm text-slate-400">The librarians are still transcribing these scrolls.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar pr-2 pb-12 auto-rows-max content-start">
          {filteredScrolls.map((scroll, index) => {
            const raw = scroll as unknown as Record<string, unknown>;
            
            const hInfo = (raw.header_info || raw.headerInfo || {}) as Record<string, unknown>;
            const sEng = (raw.social_engagement || raw.socialEngagement || raw.social || {}) as Record<string, unknown>;
            const rMeta = (raw.rpg_metadata || raw.rpgMetadata || {}) as Record<string, unknown>;

            const targetId = (typeof raw.guide_id === 'string' ? raw.guide_id : undefined)
                          || (typeof raw.id === 'string' ? raw.id : undefined) 
                          || (typeof raw.slug === 'string' ? raw.slug : undefined);
            
            const uiCover = (hInfo.cover_image_url || hInfo.cover_image || raw.cover_image_url || raw.cover_image || raw.coverImage) as string | undefined;
            
            const uiTitle = (hInfo.title || raw.title || 'Untitled Scroll') as string;
            const uiSubtitle = (hInfo.subtitle || raw.subtitle) as string | undefined;
            const uiCategory = (hInfo.category || raw.category || 'CATEGORY') as string;

            let rawAuth = hInfo.author || raw.authorInfo || raw.author_info || raw.author;
            
            if (typeof rawAuth === 'string') {
              try {
                rawAuth = JSON.parse(rawAuth);
              } catch (error) { 
                console.warn('🚨 作者欄位解碼失敗:', rawAuth, error);
                rawAuth = {};
              }
            }
            
            const auth = (rawAuth || {}) as Record<string, unknown>;
            const authName = (auth.name || raw.author_name || 'Guild Scribe') as string;
            const authAvatar = (auth.avatar_url || auth.avatarUrl || raw.author_avatar) as string | undefined;

            const uiViews = (sEng.views_count || sEng.views || raw.views_count || raw.views || 0) as number;
            const uiLikes = (sEng.mana_likes || sEng.likes || raw.mana_likes || raw.likes || 0) as number;
            const uiReadTime = (rMeta.quest_time_minutes || rMeta.readTimeMinutes || raw.quest_time_minutes || raw.readTimeMinutes || 5) as number;

            const rawDate = (raw.published_at || raw.created_at || raw.createdAt) as string | undefined;
            const dateObj = rawDate ? new Date(rawDate) : new Date();
            const formattedDate = isNaN(dateObj.getTime()) 
              ? 'Unknown Date' 
              : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateObj);

            const isBookmarked = targetId ? bookmarks.some(b => b.articleId === targetId) : false;

            return (
              <div 
                key={targetId || `fallback-key-${index}`} 
                onClick={() => {
                  if (targetId) setSelectedScrollId(targetId);
                  else console.error('無法開啟 Drawer，這篇文章的 ID 無效！');
                }}
                className="glass-panel group cursor-pointer rounded-4xl border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden bg-white/40"
              >
                {/* 封面圖區塊 */}
                <div className="relative w-full h-52 bg-slate-100 overflow-hidden shrink-0">
                  {uiCover ? (
                    <img 
                      src={uiCover} 
                      alt={uiTitle} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/f8fafc/94a3b8?text=Archive'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
                      <BookOpen className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (targetId) toggleBookmark(targetId);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-10"
                  >
                    <Bookmark className={cn("w-5 h-5 transition-colors", isBookmarked ? "fill-emerald-500 text-emerald-500" : "text-slate-400")} />
                  </button>

                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg font-mono text-[10px] font-bold tracking-widest uppercase text-slate-800 shadow-sm">
                    {uiCategory}
                  </div>
                </div>

                {/* 內容區塊 */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 font-mono text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formattedDate}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1 text-emerald-600 font-bold"><Flame className="w-3.5 h-3.5" /> {uiReadTime} min read</span>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {uiTitle}
                  </h3>
                  
                  {uiSubtitle && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1">
                      {uiSubtitle}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                        {authAvatar ? (
                          <img src={authAvatar} alt="author" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[10px]">
                            {authName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-xs text-slate-600 font-bold truncate max-w-25">
                        {authName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {uiViews}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {uiLikes}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedScrollId && (
        <ScrollDrawer scrollId={selectedScrollId} onClose={() => setSelectedScrollId(null)} />
      )}

    </div>
  );
}