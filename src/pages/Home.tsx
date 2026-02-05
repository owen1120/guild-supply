// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { productService } from '../features/inventory/services/productService';
import type { Product } from '../types/inventory';
import { ProductCard } from '../components/ui/ProductCard';
import { InventorySidebar } from '../components/inventory/InventorySidebar';
import { Pagination } from '../components/ui/Pagination';
import { Switch } from '../components/ui/Switch';
import { SortSelect, type SortOption } from '../components/ui/SortSelect';
import { cn } from '../utils/cn';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [adventureMode, setAdventureMode] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');

  // 監聽螢幕寬度
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        setItemsPerPage(12);
      } else {
        setItemsPerPage(9);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 抓取資料 (包含排序)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, totalCount } = await productService.getAll(currentPage, itemsPerPage, currentSort);
        setProducts(data);
        setTotalCount(totalCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, currentSort]);

  const handleSortChange = (value: SortOption) => {
      setCurrentSort(value);
      setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex gap-8 items-start h-full">
      <InventorySidebar />

      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden pr-1">
        
        {/* 頂部控制列 */}
        <div className="flex items-center justify-between px-2 shrink-0 z-10">
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

                {/* 排序選單 */}
                <SortSelect 
                    value={currentSort} 
                    onChange={handleSortChange} 
                />
            </div>
        </div>

        {/* 產品列表 */}
        <div className="flex-1 min-h-0 w-full relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-rows-3 gap-4 h-full w-full p-6">
            {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="w-full h-full flex items-center justify-center">
                   <div className="aspect-4/3 h-full max-w-full rounded-3xl bg-slate-100 animate-pulse glass-panel"></div>
                </div>
                ))
            ) : (
                products.map((product) => (
                    <div key={product.id} className="w-full h-full flex items-center justify-center min-h-0 min-w-0 overflow-visible p-1">
                        <div className="aspect-4/3 h-full max-w-full">
                             <ProductCard 
                                product={product} 
                                adventureMode={adventureMode}
                                className="hover:z-20 relative"
                             />
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>

        {/* 分頁 */}
        <div className="pb-4 shrink-0 mt-auto px-6 z-10">
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