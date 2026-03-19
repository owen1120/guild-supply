import { useEffect } from 'react';
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
    return () => clearCurrentScroll();
  }, [scrollId, fetchScrollById, clearCurrentScroll]);

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
        return null; 
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 w-full max-w-2xl h-full bg-white shadow-2xl z-50 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-500 custom-scrollbar">
        
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

        {/* 內容區域 */}
        <div className="flex-1 p-6 md:p-12">
          {isDetailLoading || !currentScroll ? (
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
          ) : (
            <div className="animate-in fade-in duration-500">
              
              {/* 文章標頭 */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-mono text-[10px] font-bold tracking-widest uppercase mb-4">
                  {currentScroll.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-4">
                  {currentScroll.title}
                </h1>
                {currentScroll.subtitle && (
                  <p className="text-lg text-slate-600 font-medium mb-6">
                    {currentScroll.subtitle}
                  </p>
                )}
              </div>

              {/* 文章元資料 (Metadata) */}
              <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-100 mb-10 font-mono text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  {currentScroll.authorInfo?.avatarUrl ? (
                    <img src={currentScroll.authorInfo.avatarUrl} alt="Author" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center"><User className="w-3 h-3 text-slate-500" /></div>
                  )}
                  <span className="font-bold text-slate-700">{currentScroll.authorInfo?.name || 'Guild Scribe'}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(currentScroll.createdAt).toLocaleDateString()}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><Flame className="w-3.5 h-3.5" /> {currentScroll.rpgMetadata?.readTimeMinutes || 5} min read</span>
              </div>

              {/* 動態渲染每一個內容區塊 */}
              <div className="flex flex-col">
                {currentScroll.contentBody?.map((block, index) => renderBlock(block, index))}
              </div>

              {/* 卷軸結尾標記 */}
              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2 pb-12">
                <div className="w-2 h-2 rounded-full bg-emerald-300" />
                <span className="font-mono text-[10px] tracking-widest uppercase">End of Scroll</span>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}