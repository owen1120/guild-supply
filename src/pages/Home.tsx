// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { productService } from '../features/inventory/services/productService';
import type { Product } from '../types/inventory';
import { ProductCard } from '../components/ui/ProductCard';
import { InventorySidebar } from '../components/inventory/InventorySidebar';
import { Pagination } from '../components/ui/Pagination';
import { Switch } from '../components/ui/Switch';
import { ArrowDownUp } from 'lucide-react';
import { cn } from '../utils/cn';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [adventureMode, setAdventureMode] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(9);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, totalCount } = await productService.getAll(currentPage, itemsPerPage);
        setProducts(data);
        setTotalCount(totalCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex gap-8 items-start h-full">
      <InventorySidebar />

      {/* overflow-hidden: 禁止捲動 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pr-1">
        
        {/* 頂部控制列 */}
        {/* pb-2: 稍微給一點下方空間 */}
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

                <button className="glass-panel w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-cyan-600 transition-colors cursor-pointer active:scale-95">
                    <ArrowDownUp size={20} />
                </button>
            </div>
        </div>

        {/* 產品列表 */}
        <div className="flex-1 min-h-0 w-full relative">
            {/* 💎 核心修改：p-6 (Padding)
               給予 Grid 內部足夠的呼吸空間，這樣陰影就不會被容器邊緣切斷，
               也不會因為貼得太近而被上方或下方的元素遮擋。
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-rows-3 gap-4 h-full w-full p-6">
            {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                <div key={index} className="w-full h-full flex items-center justify-center">
                   <div className="aspect-4/3 h-full max-w-full rounded-3xl bg-slate-100 animate-pulse glass-panel"></div>
                </div>
                ))
            ) : (
                products
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
                .map((product) => (
                    <div key={product.id} className="w-full h-full flex items-center justify-center min-h-0 min-w-0 overflow-visible p-1">
                        <div className="aspect-4/3 h-full max-w-full">
                             <ProductCard 
                                product={product} 
                                adventureMode={adventureMode}
                                // 💎 核心修改：hover:z-20
                                // 確保滑鼠移上去時，卡片會浮在所有介面(包括麵包屑和分頁)之上
                                className="hover:z-20 relative"
                             />
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>

        {/* 分頁 */}
        {/* z-10 確保它有自己的層級，但比 Hover 的卡片低 */}
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