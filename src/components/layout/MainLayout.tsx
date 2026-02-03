// src/components/layout/MainLayout.tsx
import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Bell, LogOut, SlidersHorizontal } from 'lucide-react';
import { 
  SiVisa, SiMastercard, SiJcb, SiApplepay, SiGooglepay, SiSamsungpay 
} from 'react-icons/si';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-slate-50">
          
          {/* Welcome Text */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">Hello, brave warrior!</h2>
            <p className="text-xs text-slate-600 font-sans">Let's go on an adventure together today!</p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-slate-50 pl-10 pr-4 py-2 rounded-md text-sm text-slate-700 outline-none focus:ring-2 focus:ring-cyan-100 w-64 transition-all font-sans"
              />
            </div>

            <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors relative flex items-center justify-center">
              <Bell size={24} />
              {/* Notification Dot */}
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors flex items-center justify-center">
              <LogOut size={24} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
                <span>World Map</span>
                <span>/</span>
                <span className="text-slate-900 font-bold">Clothes</span>
                
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-slate-500">Adventure Mode</span>
                    <div className="w-8 h-4 bg-slate-900 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                     <button className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors">
                        <SlidersHorizontal size={24} />
                    </button>
                </div>
            </div>

            {children}
        </div>

        {/* Footer (保持不變) */}
        <footer className="px-8 py-8 border-t border-slate-50 bg-slate-50/30 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <SiVisa size={24} />
                <SiMastercard size={24} />
                <SiJcb size={24} />
                <SiApplepay size={24} />
                <SiGooglepay size={24} />
                <SiSamsungpay size={24} />
            </div>
            <p className="font-serif text-[10px] tracking-widest text-slate-400 uppercase">
              © 2025 GUILD SUPPLY CO. | DESIGNED BY H.E. OWEN
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
};