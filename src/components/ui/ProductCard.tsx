import { type Product } from '../../types/inventory';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { basic_info, pricing, rpg_tuning, media } = product;
  
  const primaryImage = media.images?.find(img => img.is_primary)?.url || media.images?.[0]?.url;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'SSR': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'SR': return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
      case 'R': return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
      default: return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        {primaryImage ? (
          <img 
            src={primaryImage} 
            alt={basic_info.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            No Image
          </div>
        )}
        
        <div className={cn(
          "absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded backdrop-blur-md border",
          getRarityColor(rpg_tuning.rarity)
        )}>
          {rpg_tuning.rarity}
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {basic_info.ribbons.map(ribbon => (
            <span key={ribbon} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-black/70 backdrop-blur-md rounded">
              {ribbon}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
            {basic_info.brand}
          </p>
          <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight min-h-10">
            {basic_info.name}
          </h3>
        </div>

        <div className="flex gap-2 text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded-lg">
           {rpg_tuning.stats.def && <span>🛡️ DEF {rpg_tuning.stats.def}</span>}
           {rpg_tuning.stats.agi && <span>⚡ AGI {rpg_tuning.stats.agi}</span>}
           {!rpg_tuning.stats.def && !rpg_tuning.stats.agi && <span>Analyzation Pending...</span>}
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
          <div className="flex flex-col">
             <span className="text-xs text-slate-400">Price</span>
             <span className="text-lg font-black text-slate-900">
               ${pricing.base_price.toLocaleString()}
             </span>
          </div>
          
          <Button variant="primary" size="md" icon className="rounded-full">
            🛒
          </Button>
        </div>
      </div>
    </div>
  );
};