import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { InventorySidebar } from '../components/inventory/InventorySidebar';

const ProductDetails = () => {
  const { id } = useParams(); // 取得網址上的 id

  return (
    <div className="flex gap-8 items-start">
      <InventorySidebar />
      
      <div className="flex-1 p-8">
        {/* 返回按鈕 */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold">Back to Guild</span>
        </Link>

        {/* 暫時的內容 */}
        <div className="glass-panel p-12 text-center rounded-3xl">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Analyzing Artifact...</h1>
          <p className="text-slate-500 font-mono">ID: {id}</p>
          <div className="mt-8 inline-block animate-pulse text-cyan-500">
             [ 此處即將具現化詳細裝備數據 ]
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;