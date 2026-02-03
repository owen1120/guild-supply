// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { productService } from '../features/inventory/services/productService';
import type { Product } from '../types/inventory';
import { ProductCard } from '../components/ui/ProductCard';
import { InventorySidebar } from '../components/inventory/InventorySidebar';
import { Pagination } from '../components/ui/Pagination';
// 👇 引入 Switch
import { Switch } from '../components/ui/Switch';
import { SlidersHorizontal } from 'lucide-react'; // 裝飾用 Icon

const Home = () => {
  // ... (原本的 state 保持不變)
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 9;

  // ✨ 新增：Adventure Mode 狀態 (預設關閉)
  const [adventureMode, setAdventureMode] = useState(false);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    // ... (fetchData 保持不變) ...
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
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex gap-8 items-start">
      <InventorySidebar />

      <div className="flex-1 flex flex-col gap-8">
        
        {/* ✨ 新增：頂部工具列 (麵包屑 + Toggle) */}
        {/* 對照 image_a8083e.png 的上方區域 */}
        <div className="flex items-center justify-between pt-2">
            
            {/* 左側：麵包屑 */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>World map</span>
                <SlidersHorizontal size={12} />
                <span className="text-slate-900 font-bold">Clothes</span>
            </div>

            {/* 右側：Adventure Mode Toggle */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Adventure Mode
                </span>
                <Switch 
                    checked={adventureMode} 
                    onCheckedChange={setAdventureMode} 
                />
            </div>
        </div>

        {/* 網格區域：將 adventureMode 傳入 ProductCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 min-h-150">
          {loading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <div key={index} className="aspect-4/5 rounded-3xl bg-slate-100 animate-pulse glass-panel"></div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                adventureMode={adventureMode} // 👈 傳遞狀態！
              />
            ))
          )}
        </div>

        {/* 底部頁面標籤 */}
        <div className="pb-12">
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