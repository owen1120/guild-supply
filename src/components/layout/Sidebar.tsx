// src/components/layout/Sidebar.tsx
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
  // 共用的按鈕樣式
  const buttonBaseClass = "p-2 rounded-xl transition-all duration-300 relative group flex items-center justify-center cursor-pointer";

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center bg-white border-r border-slate-100 py-6 z-50 overflow-y-auto no-scrollbar">
      
      {/* Logo */}
      <div className={cn(buttonBaseClass, "mb-8 hover:bg-slate-50 shrink-0")}>
        <img 
          src="/guild-supply.svg" 
          alt="Guild Supply" 
          className="w-6 h-6 object-contain"
        />
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-4 w-full items-center shrink-0">
        {MENU_ITEMS.map((item, index) => (
          <button
            key={index}
            className={cn(
              buttonBaseClass,
              item.active 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            )}
          >
            <item.icon size={24} strokeWidth={item.active ? 2.5 : 2} />
            
            {/* Tooltip */}
            <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 font-bold tracking-wide font-sans">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1 min-h-8" />

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 w-full items-center shrink-0 mb-6">
        {BOTTOM_ITEMS.map((item, index) => (
          <button key={index} className={cn(buttonBaseClass, "text-slate-400 hover:text-slate-600 hover:bg-slate-50")}>
            <item.icon size={24} />
          </button>
        ))}
      </div>

      {/* Settings Group */}
      <div className="flex flex-col gap-4 w-full items-center pt-6 border-t border-slate-100 shrink-0">
         {FOOTER_ITEMS.map((item, index) => (
          <button key={index} className={cn(buttonBaseClass, "text-slate-300 hover:text-slate-500 hover:bg-slate-50")}>
            <item.icon size={24} />
          </button>
        ))}
      </div>

    </aside>
  );
};