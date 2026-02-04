import { type ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Bell, LogIn } from 'lucide-react';
import { 
  SiVisa, SiMastercard, SiJcb, SiApplepay, SiGooglepay, SiSamsungpay 
} from 'react-icons/si';
import { cn } from '../../utils/cn';
import { Input } from '../ui/Input';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const iconButtonClass = "glass-panel w-10 h-10 flex items-center justify-center rounded-xl text-slate-900 hover:text-cyan-600 transition-colors cursor-pointer active:scale-95";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      
      <Sidebar />

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        
        <header className="shrink-0 z-40 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-slate-50">
           <div className="flex-1">
               <h1 className="text-2xl font-bold text-slate-800">Hello, brave warrior</h1>
               <p className="text-slate-400 text-xs">Welcome back to the guild supply depot.</p>
           </div>
           
           <div className="flex items-center gap-8 ml-auto">
               
               <div className="w-64">
                 <Input 
                    placeholder="Search equipment..." 
                    startIcon={<Search size={18} />} 
                    inputSize="md"
                    
                    value={searchQuery}
                    
                    onChange={(e) => setSearchQuery(e.target.value)}
                    
                    onClear={() => setSearchQuery('')}

                    variant={searchQuery.length > 0 ? 'typing' : 'default'}
                 />
               </div>

               <button className={cn(iconButtonClass, "relative")}>
                   <Bell size={20} />
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full border border-white"></span>
               </button>

               <button className={iconButtonClass}>
                   <LogIn size={20} />
               </button>
           </div>
        </header>

        <div className="flex-1 p-8 flex flex-col overflow-hidden">
             {children}
        </div>

        <footer className="shrink-0 px-8 py-4 border-t border-slate-50 bg-slate-50/30">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <SiVisa size={24} /><SiMastercard size={24} /><SiJcb size={24} />
                    <SiApplepay size={24} /><SiGooglepay size={24} /><SiSamsungpay size={24} />
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