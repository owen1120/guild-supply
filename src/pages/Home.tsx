// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { productService } from '../features/inventory/services/productService';
import type { Product } from '../types/inventory';
import { ProductCard } from '../components/ui/ProductCard';
// 👇 引入新做好的側邊欄
import { InventorySidebar } from '../components/inventory/InventorySidebar';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex gap-8 items-start">
      
      {/* ✅ 替換：這裡原本是醜醜的 div，現在換成高級組件 */}
      <InventorySidebar />

      {/* 產品卡片網格 (保持不變，但加上 flex-1 讓它佔滿剩餘空間) */}
      <div className="flex-1">
        {/* 這裡我們微調一下 gap，讓卡片不要太擠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-8">
            {loading ? (
            <div className="col-span-full h-96 flex items-center justify-center text-slate-400 font-mono animate-pulse">
                SCANNING GUILD DATABASE...
            </div>
            ) : (
            products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;