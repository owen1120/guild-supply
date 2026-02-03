import { 
  Home, Swords, ScrollText, MessageSquareWarning, ShieldQuestion, 
  Backpack, Heart, UserRound, Radio, Scale, Settings 
} from 'lucide-react';
import { cn } from '../../utils/cn';

const MENU_ITEMS = [
  { icon: Home, label: 'Home', active: false },
  { icon: Swords, label: 'Equipment', active: true },
  { icon: ScrollText, label: 'Quests', active: false },
  { icon: MessageSquareWarning, label: 'Notices', active: false },
  { icon: ShieldQuestion, label: 'Support', active: false },
];

const BOTTOM_ITEMS = [
  { icon: Backpack, label: 'Inventory' },
  { icon: Heart, label: 'Wishlist' },
  { icon: UserRound, label: 'Profile' },
];

const FOOTER_ITEMS = [
  { icon: Radio, label: 'Signal' },
  { icon: Scale, label: 'Rules' },
  { icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const getButtonClass = (isActive: boolean = false) => {
    return cn(
      "p-2 rounded-xl transition-all duration-300 relative group flex items-center justify-center cursor-pointer",
      
      isActive 
        ? [
            "bg-cyan-400/40 glass-panel-cyan text-cyan-900 shadow-cyan-glow/20"
          ]
        : [
            "text-slate-600",
            "hover:glass-panel-cyan hover:text-cyan-600"
          ]
    );
  };

  return (
    <aside className="sticky top-0 h-screen p-6 flex flex-col shrink-0 z-50">
      
      <div className="glass-panel w-20 flex-1 flex flex-col justify-between items-center py-4 px-2 rounded-3xl transition-all duration-500 hover:border-white/60">

        <div className="flex flex-col gap-8 w-full items-center">
          
          <div className={cn(getButtonClass(false), "shrink-0")}>
            <img 
              src="/guild-supply.svg" 
              alt="Guild Supply" 
              className="w-6 h-6 object-contain opacity-70 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            />
          </div>

          <nav className="flex flex-col gap-4 w-full items-center">
            {MENU_ITEMS.map((item, index) => (
              <button
                key={index}
                className={getButtonClass(item.active)}
              >
                <item.icon size={24} strokeWidth={item.active ? 2.5 : 2} />
                
                <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 font-bold tracking-wide font-sans">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 w-full items-center">
          
          <div className="flex flex-col gap-4 w-full items-center">
            {BOTTOM_ITEMS.map((item, index) => (
              <button key={index} className={getButtonClass(false)}>
                <item.icon size={24} />
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full items-center pt-4 border-t border-slate-200/50">
             {FOOTER_ITEMS.map((item, index) => (
              <button key={index} className={getButtonClass(false)}>
                <item.icon size={24} />
              </button>
            ))}
          </div>

        </div>

      </div>
    </aside>
  );
};