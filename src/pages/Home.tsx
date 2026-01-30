import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { productService } from '../features/inventory/services/productService';
import { type Product } from '../types/inventory';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        console.log("獵取到的寶石:", data);
        setProducts(data);
      } catch (err) {
        console.error("獵取失敗:", err);
        setError("無法連接到補給庫，請檢查 json-server 是否啟動。");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900 gap-8 p-8">
      
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600 tracking-tight">
          Guild Supply
        </h1>
        <p className="text-slate-400 text-xl">
          目前庫存數量: {loading ? "計算中..." : products.length}
        </p>
      </div>

      {loading && <div className="text-cyan-400 animate-pulse">正在掃描庫存...</div>}
      
      {error && <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/50">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
              <h3 className="text-white font-bold text-lg mb-2">{product.basic_info.name}</h3>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-bold 
                  ${product.rpg_tuning.rarity === 'SSR' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 'bg-slate-700 text-slate-300'}
                `}>
                  {product.rpg_tuning.rarity}
                </span>
                <span className="text-cyan-400 font-mono">
                  ${product.pricing.base_price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 items-center mt-8">
        <Button variant="primary" size="lg" icon>
          ✚
        </Button>
        <Button variant="link">
          查看完整清單
        </Button>
      </div>
    </div>
  );
};

export default Home;