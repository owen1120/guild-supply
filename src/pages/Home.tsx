import { useState, useEffect, useRef } from 'react';
import { 
  Diamond, 
  ChartColumn, 
  MessageSquareWarning, 
  Loader2,
  ArrowBigRightDash 
} from 'lucide-react';
import { cn } from '../utils/cn';
import { productService } from '../features/inventory/services/productService';
import { libraryService } from '../features/library/services/libraryService';
import type { Product } from '../types/inventory';
import type { Article } from '../types/library';

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const showIntro = !isStarted && countdown > 0;

  const topPicksRef = useRef<HTMLDivElement>(null);
  const articlesListRef = useRef<HTMLDivElement>(null); 
  const [gridCols, setGridCols] = useState(3); 
  const [topPickLimit, setTopPickLimit] = useState(6); 
  const [articleLimit, setArticleLimit] = useState(3); 

  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [topPicks, setTopPicks] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!showIntro) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [showIntro]);

  useEffect(() => {
    const container = topPicksRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        const { width } = entries[0].contentRect;
        const cols = Math.ceil((width + 24) / (200 + 24));
        const actualCols = Math.max(1, cols);
        setGridCols(actualCols); 
        setTopPickLimit(actualCols * 2); 
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = articlesListRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        const { height } = entries[0].contentRect;
        const minItemHeight = 64; 
        const gap = 16;
        const count = Math.floor((height + gap) / (minItemHeight + gap));
        setArticleLimit(Math.max(1, count));
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [featuredItems, picksRes, latestArticles] = await Promise.all([
          productService.getFeatured(),
          productService.getAll(1, 15, 'newest'),
          libraryService.getLatestScrolls(10) 
        ]);

        const hero = featuredItems.length > 0 ? featuredItems[0] : null;
        setHeroProduct(hero);

        const filteredPicks = picksRes.data.filter(p => p.id !== hero?.id);
        setTopPicks(filteredPicks);

        setArticles(latestArticles);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStart = () => setIsStarted(true);

  return (
    <div className="relative h-full w-full overflow-hidden text-slate-900">
      
      <div
        className={cn(
          "absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-1000 ease-out",
          showIntro 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-12 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center transform transition-transform duration-700 hover:scale-105">
            <h1 className="text-[60px] leading-none font-bold font-serif text-cyan-400 mb-12 tracking-widest text-center drop-shadow-sm">
              "WAKE UP, ADVENTURER..."
            </h1>

            <button
              onClick={handleStart}
              className={cn(
                "group relative flex items-center gap-3 px-10 py-4 overflow-hidden transition-all duration-300 hover:-translate-y-1",
                "rounded-xl",
                "glass-panel outline-lg",
                "text-slate-600 hover:text-cyan-400 font-mono font-bold text-xl tracking-widest hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              )}
            >
              <Diamond className="w-5 h-5 transition-colors duration-300" />
              <span className="relative z-10 transition-colors duration-300">START JOURNEY</span>
              <Diamond className="w-5 h-5 transition-colors duration-300" />
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>

            <p className="mt-8 text-cyan-700/60 font-mono text-sm tracking-widest animate-pulse">
              Auto start in {countdown} seconds...
            </p>
        </div>
      </div>

      <div className="flex h-full w-full p-8 gap-6">
         
         <div className="h-full aspect-square rounded-3xl glass-panel outline-lg flex flex-col items-center justify-center shrink-0 group hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-500 overflow-hidden relative cursor-pointer">
             {isLoading ? (
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin opacity-50" />
             ) : heroProduct ? (
                <>
                  <img 
                    src={heroProduct.visuals.icon} 
                    alt={heroProduct.basic_info.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-mono font-bold tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {heroProduct.basic_info.name}
                      </span>
                  </div>
                </>
             ) : (
                <span className="text-slate-400 font-mono text-sm">No Item Found</span>
             )}
         </div>

         <div className="flex-1 flex flex-col h-full min-w-0 gap-6">
            
            <div className="flex flex-col gap-4">
               <h2 className="flex items-center gap-2 font-mono font-bold text-slate-500 tracking-widest">
                  <ChartColumn className="w-5 h-5" />
                  TOP PICKS
               </h2>
               
               <div 
                 ref={topPicksRef} 
                 className="grid gap-6 justify-start content-start"
                 style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
               >
                  {isLoading ? (
                    Array.from({ length: topPickLimit }).map((_, i) => (
                      <div key={`skel-${i}`} className="w-full aspect-square rounded-2xl glass-panel outline-lg flex items-center justify-center animate-pulse bg-slate-200/50" />
                    ))
                  ) : topPicks.length > 0 ? (
                    topPicks.slice(0, topPickLimit).map((product) => (
                      <div 
                        key={product.id} 
                        className="w-full aspect-square rounded-2xl glass-panel outline-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] overflow-hidden relative cursor-pointer group"
                      >
                          <img 
                            src={product.visuals.icon} 
                            alt={product.basic_info.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 font-mono text-sm">Not enough data.</span>
                  )}
               </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 pt-2">
               <h2 className="flex items-center gap-2 font-mono font-bold text-slate-500 tracking-widest mb-4 shrink-0">
                  <MessageSquareWarning className="w-5 h-5" />
                  ARTICLES
               </h2>
               
               <div ref={articlesListRef} className="flex-1 flex flex-col gap-4 min-h-0">
                   {isLoading ? (
                     Array.from({ length: articleLimit }).map((_, i) => (
                       <div key={`skel-art-${i}`} className="grow min-h-16 rounded-2xl glass-panel outline-lg animate-pulse bg-slate-200/50" />
                     ))
                   ) : articles.length > 0 ? (
                     articles.slice(0, articleLimit).map((article) => (
                       <div 
                         key={article.guide_id} 
                         className="grow min-h-16 px-6 py-4 rounded-2xl glass-panel outline-lg flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer group bg-white/40"
                       >
                           <span className="text-[16px] font-bold font-sans text-slate-600 group-hover:text-cyan-600 transition-colors line-clamp-1 mr-4">
                             {article.title}
                           </span>
                           
                           <ArrowBigRightDash className="w-8 h-8 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
                       </div>
                     ))
                   ) : (
                     <div className="grow min-h-16 rounded-2xl glass-panel outline-lg flex items-center justify-center">
                        <span className="text-slate-400 font-mono text-sm">No scrolls found in the library.</span>
                     </div>
                   )}
               </div>
            </div>

         </div>
      </div>

    </div>
  );
}