// src/features/library/components/ScrollDrawer.tsx
import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, Flame, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { Skeleton } from '../../../components/ui/Skeleton';
import type { ContentBlock } from '../services/libraryService';

interface ScrollDrawerProps {
  scrollId: string;
  onClose: () => void;
}

export default function ScrollDrawer({ scrollId, onClose }: ScrollDrawerProps) {
  const { currentScroll, isDetailLoading, fetchScrollById, clearCurrentScroll } = useLibraryStore();

  useEffect(() => {
    fetchScrollById(scrollId);
    document.body.style.overflow = 'hidden';
    
    return () => {
      clearCurrentScroll();
      document.body.style.overflow = 'unset';
    };
  }, [scrollId, fetchScrollById, clearCurrentScroll]);

  // 💎 終極翻譯蒟蒻：徹底消滅 any，並確保所有變數都有被使用
  const safeData = useMemo(() => {
    if (!currentScroll) return null;
    
    // 嚴格型別轉換，取代 any
    const raw = currentScroll as unknown as Record<string, unknown>;
    
    // 破解巢狀口袋並給予嚴格型別
    const headerInfo = (raw.header_info || raw.headerInfo || {}) as Record<string, unknown>;
    const rpg = (raw.rpg_metadata || raw.rpgMetadata || {}) as Record<string, unknown>;
    const author = (headerInfo.author || raw.authorInfo || raw.author_info || {}) as Record<string, unknown>;

    // 刪除了沒用到的 social 變數，迎合結界規則！

    return {
      title: (headerInfo.title || raw.title || 'Untitled Scroll') as string,
      subtitle: (headerInfo.subtitle || raw.subtitle) as string | undefined,
      category: (headerInfo.category || raw.category || 'CATEGORY') as string,
      
      // 內文區塊
      contentBody: raw.content_body || raw.contentBody,
      
      // 作者資訊
      authorInfo: {
        name: author.name as string | undefined,
        avatarUrl: (author.avatar_url || author.avatarUrl) as string | undefined,
        title: (author.rank_title || author.title) as string | undefined
      },
      
      // RPG 資訊
      rpgMetadata: {
        readTimeMinutes: (rpg.quest_time_minutes || rpg.readTimeMinutes) as number | undefined,
        difficulty: (rpg.difficulty_level || rpg.difficulty) as string | undefined,
        tags: rpg.tags as string[] | undefined
      },
      
      // 日期
      createdAt: (raw.created_at || raw.createdAt) as string | undefined
    };
  }, [currentScroll]);

  const safeBlocks: ContentBlock[] = useMemo(() => {
    if (!safeData?.contentBody) return [];

    const rawBody = safeData.contentBody;

    if (Array.isArray(rawBody)) {
      return rawBody as ContentBlock[];
    }

    if (typeof rawBody === 'string') {
      try {
        const parsed = JSON.parse(rawBody);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed.blocks)) return parsed.blocks;
        if (parsed && typeof parsed.type === 'string') return [parsed];
      } catch (error) {
        console.error('🚨 [Omni-Parser] JSON 字串解析失敗！', error);
        return [];
      }
    }

    if (typeof rawBody === 'object' && rawBody !== null) {
      const objBody = rawBody as Record<string, unknown>;
      if (Array.isArray(objBody.blocks)) return objBody.blocks as ContentBlock[];
      if (typeof objBody.type === 'string') return [objBody as unknown as ContentBlock];
      const values = Object.values(objBody);
      if (values.length > 0 && typeof (values[0] as Record<string, unknown>)?.type === 'string') {
        return values as ContentBlock[];
      }
    }

    return [];
  }, [safeData]);

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'TEXT_BLOCK':
        return (
          <div key={index} className="mb-8">
            {block.heading && (
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">{block.heading}</h3>
            )}
            <div 
              className="prose prose-slate prose-emerald max-w-none text-slate-700 leading-relaxed font-serif"
              dangerouslySetInnerHTML={{ __html: block.content }} 
            />
          </div>
        );
      case 'WARNING_BLOCK':
        return (
          <div key={index} className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-start shadow-sm">
            <div className="bg-amber-100 p-2 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-amber-900 leading-relaxed text-sm font-medium">
              {block.content}
            </div>
          </div>
        );
      case 'IMAGE_BLOCK':
        return (
          <div key={index} className="mb-8 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <img src={block.url} alt={block.caption || 'Scroll illustration'} className="w-full h-auto max-h-125 object-cover" />
            {block.caption && (
              <div className="p-3 bg-white text-center text-xs font-mono text-slate-500 border-t border-slate-100">
                {block.caption}
              </div>
            )}
          </div>
        );
      case 'CHECKLIST_BLOCK':
        return (
          <div key={index} className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Preparation Checklist</h4>
            <ul className="flex flex-col gap-3">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        console.warn(`⚠️ 未知的 Block 類型: ${(block as Record<string, unknown>)?.type}`);
        return null;
    }
  };

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 w-full max-w-2xl h-full bg-white shadow-2xl z-101 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-500 custom-scrollbar">
        
        <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
            Scroll Reading Mode
          </div>
          <div className="w-10 h-10" /> 
        </div>

        <div className="flex-1 p-6 md:p-12">
          {isDetailLoading ? (
            <div className="flex flex-col gap-6 animate-pulse">
              <Skeleton className="w-24 h-6 rounded-full" />
              <Skeleton className="w-full h-12" />
              <div className="flex gap-4">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-4" />
              </div>
              <Skeleton className="w-full h-64 rounded-3xl mt-6" />
              <Skeleton className="w-full h-32 rounded-2xl mt-6" />
            </div>
          ) : !safeData ? (
            <div className="text-center py-20 text-slate-500">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">無法解開卷軸</h2>
              <p>找不到該文章的詳細內容，可能是 API 呼叫失敗或文章已損毀。</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase mb-4">
                  {safeData.category}
                </span>
                
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-4">
                  {safeData.title}
                </h1>
                
                {safeData.subtitle && (
                  <p className="text-lg text-slate-600 font-medium mb-6">
                    {safeData.subtitle}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-100 mb-10 font-mono text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  {safeData.authorInfo.avatarUrl ? (
                    <img src={safeData.authorInfo.avatarUrl} alt="Author" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center"><User className="w-3 h-3 text-slate-500" /></div>
                  )}
                  <span className="font-bold text-slate-700">{safeData.authorInfo.name || 'Guild Scribe'}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {safeData.createdAt ? new Date(safeData.createdAt).toLocaleDateString() : 'Unknown Date'}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><Flame className="w-3.5 h-3.5" /> {safeData.rpgMetadata.readTimeMinutes || 5} min read</span>
              </div>

              <div className="flex flex-col">
                {safeBlocks.length > 0 ? (
                  safeBlocks.map((block, index) => renderBlock(block, index))
                ) : (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    內容正在撰寫中，或是格式無法解析...
                  </div>
                )}
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2 pb-12">
                <div className="w-2 h-2 rounded-full bg-emerald-300" />
                <span className="font-mono text-[10px] tracking-widest uppercase">End of Scroll</span>
              </div>

            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}