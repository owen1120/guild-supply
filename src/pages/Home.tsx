// src/pages/Home.tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { productService } from '../features/inventory/services/productService';
import type { Product } from '../types/inventory';
import { ProductCard } from '../components/ui/ProductCard';
import { InventorySidebar, type FilterState } from '../components/inventory/InventorySidebar';
import { Pagination } from '../components/ui/Pagination';
import { Switch } from '../components/ui/Switch';
import { SortSelect, type SortOption } from '../components/ui/SortSelect';
import { cn } from '../utils/cn';

const CARD_MIN_WIDTH = 280; 
const GAP_SIZE = 16; 
const PADDING_X = 48; 
const PADDING_Y = 48;
const TEXT_HEIGHT_BUFFER = 80; 

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [adventureMode, setAdventureMode] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');
  const [activeFilters, setActiveFilters] = useState<FilterState | undefined>(undefined);

  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [gridCols, setGridCols] = useState(3);
  
  // 💎 新增：儲存計算出來的卡片高度
  const [cardHeight, setCardHeight] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current) return;

    // 1. 取得容器可用空間
    const { width, height } = containerRef.current.getBoundingClientRect();
    const availableWidth = width - PADDING_X;
    const availableHeight = height - PADDING_Y;

    // 2. 先計算橫向幾欄
    const colsRaw = Math.floor((availableWidth + GAP_SIZE) / (CARD_MIN_WIDTH + GAP_SIZE));
    const cols = Math.max(1, colsRaw);

    // 3. 計算真實卡片高度
    const actualCardWidth = (availableWidth - (cols - 1) * GAP_SIZE) / cols;
    // 圖片 4:3 + 文字緩衝
    const calculatedHeight = (actualCardWidth * 0.75) + TEXT_HEIGHT_BUFFER;

    // 4. 計算直向幾列
    const rowsRaw = Math.floor((availableHeight + GAP_SIZE) / (calculatedHeight + GAP_SIZE));
    const rows = Math.max(1, rowsRaw);

    // 5. 更新所有狀態
    setGridCols(prev => (prev !== cols ? cols : prev));
    
    // 💎 把算出來的高度存起來！這就是防止壓扁的關鍵
    setCardHeight(calculatedHeight);
    
    const optimalCount = cols * rows;
    setItemsPerPage(prev => (prev !== optimalCount ? optimalCount : prev));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        calculateLayout();
      });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [calculateLayout]);

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, totalCount } = await productService.getAll(
            currentPage, 
            itemsPerPage, 
            currentSort, 
            activeFilters
        );
        setProducts(data);
        setTotalCount(totalCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, currentSort, activeFilters]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }
  }, [itemsPerPage, totalPages, currentPage]);

  const handleSortChange = (value: SortOption) => {
      setCurrentSort(value);
      setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = (filters: FilterState) => {
      setActiveFilters(filters);
      setCurrentPage(1);
  };

  return (
    <div className="flex gap-8 items-start h-full">
      <InventorySidebar onApply={handleApplyFilters} />

      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden pr-1">
        
        {/* 頂部控制列 */}
        <div className="flex items-center justify-between pt-4 px-2 pb-2 shrink-0 z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-900 font-bold uppercase tracking-wider">
                <span>World map</span>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-xs font-mono font-bold uppercase tracking-wider transition-colors",
                      adventureMode ? "text-cyan-600" : "text-slate-500"
                    )}>
                        Adventure Mode
                    </span>
                    <Switch 
                        checked={adventureMode} 
                        onCheckedChange={setAdventureMode} 
                    />
                </div>
                <SortSelect value={currentSort} onChange={handleSortChange} />
            </div>
        </div>

        {/* 產品列表容器 */}
        <div className="flex-1 min-h-0 w-full relative">
            <div 
                ref={containerRef}
                className="grid gap-4 h-full w-full p-6 content-start"
                style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
                }}
            >
            {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="w-full flex items-center justify-center">
                   {/* 💎 Loading 狀態也要套用計算出的高度，避免閃爍 */}
                   <div 
                      className="w-full rounded-3xl bg-slate-100 animate-pulse glass-panel"
                      style={{ height: cardHeight > 0 ? cardHeight : 'auto' }}
                   ></div>
                </div>
                ))
            ) : products.length > 0 ? (
                products.map((product) => (
                    <div key={product.id} className="w-full flex items-center justify-center min-h-0 min-w-0 overflow-visible p-1">
                        {/* 💎 關鍵修正：直接將算出來的高度賦予給卡片容器！
                            這樣卡片就會撐開到我們期望的大小，不再是被壓扁的狀態，
                            同時也保證了高度跟我們的 itemsPerPage 計算邏輯完全一致。
                        */}
                        <div 
                            className="w-full"
                            style={{ height: cardHeight > 0 ? cardHeight : 'auto' }}
                        >
                             <ProductCard 
                                product={product} 
                                adventureMode={adventureMode}
                                className="hover:z-20 relative h-full" 
                             />
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="text-lg font-bold font-serif">No artifacts found.</p>
                    <p className="text-sm">Try adjusting your filters.</p>
                </div>
            )}
            </div>
        </div>

        {/* 分頁 */}
        <div className="pb-8 shrink-0 mt-auto px-6 z-10">
           <Pagination 
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={handlePageChange}
           />
        </div>

      </div>
    </div>
  );
};

export default Home;