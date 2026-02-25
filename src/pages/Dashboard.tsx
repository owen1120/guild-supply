// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { 
  Swords, Shield, HelpCircle, 
  MapPin, ShoppingBag, CreditCard, Bell, ChevronRight, Loader2, Globe, ArrowRightSquare
} from 'lucide-react';
import { useProfileStore } from '../features/profile/store/useProfileStore';

type DashboardView = 'overview' | 'address' | 'orders';

export default function Dashboard() {
  const { profile, isLoading, fetchProfile, fetchAddresses } = useProfileStore();
  const [activeView, setActiveView] = useState<DashboardView>('overview');

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, [fetchProfile, fetchAddresses]);

  if (isLoading && !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-0">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
        <p className="font-mono text-slate-500 tracking-widest animate-pulse">Syncing Guild License...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0 px-[clamp(16px,2vw,32px)] pb-[clamp(16px,2vh,32px)] overflow-hidden">
      
      {/* 🌟 上半部：英雄執照 (Hero's License) */}
      <div className="shrink-0 flex flex-col gap-[clamp(8px,1.5vh,24px)] pt-[clamp(8px,1vh,16px)] mb-[clamp(12px,2vh,32px)]">
        
        <div className="text-center pb-[clamp(4px,1vh,16px)] pt-[clamp(4px,1vh,8px)]">
          <h2 className="text-[clamp(24px,4vh,48px)] font-serif font-bold text-slate-900 tracking-widest uppercase leading-none">
            Hero's License
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[clamp(8px,1.5vh,16px)]">
          
          <div className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex items-center gap-[clamp(12px,1.5vw,24px)] border border-white/60 shadow-sm">
            <div className="w-[clamp(48px,6vh,64px)] h-[clamp(48px,6vh,64px)] bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
              <Swords className="w-1/2 h-1/2 text-slate-700" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[clamp(10px,1.2vh,14px)] text-slate-500 font-bold mb-1">Lv.{profile?.level || 1}</p>
              <h3 className="font-serif text-[clamp(16px,2vh,24px)] font-bold text-slate-900 uppercase truncate">
                {profile?.firstName || profile?.realName || 'Adventurer'}
              </h3>
            </div>
          </div>

          <div className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex flex-col justify-center border border-white/60 shadow-sm">
            <h3 className="font-serif text-[clamp(14px,1.8vh,20px)] font-bold text-slate-900 uppercase mb-[clamp(4px,0.5vh,8px)] truncate">
              {profile?.rankTitle || 'BRONZE MEMBER'}
            </h3>
            <p className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-500 truncate">Your progress & rewards</p>
          </div>

          <div className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex flex-col justify-center border border-white/60 shadow-sm">
            <p className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-500 font-bold uppercase tracking-widest mb-[clamp(4px,0.5vh,8px)]">Active</p>
            <h3 className="font-sans text-[clamp(24px,3vh,36px)] font-bold text-slate-800 leading-none">3</h3>
          </div>

          <div className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex flex-col justify-center border border-white/60 shadow-sm">
            <p className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-500 font-bold uppercase tracking-widest mb-[clamp(4px,0.5vh,8px)]">Credits</p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-sans text-[clamp(24px,3vh,36px)] font-bold text-slate-800 leading-none truncate">
                {profile?.points?.toLocaleString() || '0'}
              </h3>
              <span className="font-mono text-[clamp(10px,1.2vh,14px)] text-slate-500">pts</span>
            </div>
          </div>

        </div>
      </div>

      {/* 🧩 下半部：動態內容區塊 */}
      <div className="flex-1 min-h-0 relative">
        
        {/* === 視圖 A：總覽便當盒 (Overview Grid) === */}
        {activeView === 'overview' && (
          // 💎 將網格改為 4 欄 (lg:grid-cols-4)，左邊佔 2 欄，右邊各佔 1 欄
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-[clamp(12px,2vh,24px)] h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1️⃣ 左側大區塊：個人細節表單 (佔 2 欄) */}
            <div className="lg:col-span-2 glass-panel p-[clamp(16px,3vh,32px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex flex-col min-h-0">
              <h3 className="font-mono text-[clamp(11px,1.3vh,14px)] font-bold text-slate-800 tracking-widest uppercase mb-[clamp(12px,2vh,24px)] shrink-0">
                My details
              </h3>
              
              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(12px,1.5vw,24px)] gap-y-[clamp(8px,1.5vh,16px)]">
                <div className="flex flex-col gap-[clamp(4px,0.5vh,8px)] justify-center">
                  <label className="font-mono text-[clamp(10px,1.2vh,12px)] font-bold text-slate-600">First name:</label>
                  <input type="text" defaultValue={profile?.firstName || ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-[clamp(12px,1.4vh,14px)] text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="flex flex-col gap-[clamp(4px,0.5vh,8px)] justify-center">
                  <label className="font-mono text-[clamp(10px,1.2vh,12px)] font-bold text-slate-600">Last name:</label>
                  <input type="text" defaultValue={profile?.lastName || ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-[clamp(12px,1.4vh,14px)] text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="flex flex-col gap-[clamp(4px,0.5vh,8px)] justify-center md:col-span-2">
                  <label className="font-mono text-[clamp(10px,1.2vh,12px)] font-bold text-slate-600">Email address:</label>
                  <input type="email" defaultValue={profile?.email || ''} readOnly className="w-full bg-slate-100/50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-[clamp(12px,1.4vh,14px)] text-slate-500 cursor-not-allowed" />
                </div>
                <div className="flex flex-col gap-[clamp(4px,0.5vh,8px)] justify-center">
                  <label className="font-mono text-[clamp(10px,1.2vh,12px)] font-bold text-slate-600">Date of birth:</label>
                  <input type="date" defaultValue={profile?.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-[clamp(12px,1.4vh,14px)] text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
                <div className="flex flex-col gap-[clamp(4px,0.5vh,8px)] justify-center">
                  <label className="font-mono text-[clamp(10px,1.2vh,12px)] font-bold text-slate-600">Phone number:</label>
                  <input type="text" defaultValue={profile?.phone || ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-[clamp(12px,1.4vh,14px)] text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" />
                </div>
              </div>

              <div className="shrink-0 pt-[clamp(12px,2vh,16px)] flex justify-end">
                <button className="px-[clamp(16px,2vw,32px)] py-[clamp(8px,1.5vh,12px)] bg-slate-900 text-white font-mono text-[clamp(12px,1.4vh,14px)] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95">
                  Save Changes
                </button>
              </div>
            </div>

            {/* 2️⃣ 中間專欄：My Account & Support (佔 1 欄) */}
            <div className="flex flex-col gap-[clamp(12px,2vh,24px)] h-full min-h-0">
              
              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-around">
                <h3 className="font-mono text-[clamp(11px,1.3vh,14px)] font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 shrink-0">
                  <Shield className="w-4 h-4" /> My account
                </h3>
                <div className="flex flex-col justify-evenly flex-1 min-h-0">
                  <button className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><ShoppingBag className="w-4 h-4" /> Orders & returns</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                  <button className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Payment</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                  {/* 切換到地址簿的按鈕 */}
                  <button onClick={() => setActiveView('address')} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Address book</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                  <button className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Communication</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                </div>
              </div>

              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-around">
                <h3 className="font-mono text-[clamp(11px,1.3vh,14px)] font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 shrink-0">
                  <HelpCircle className="w-4 h-4" /> Support
                </h3>
                <div className="flex flex-col justify-evenly flex-1 min-h-0">
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left">About GUILD SUPPLY</button>
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left">Terms & conditions</button>
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left">Privacy policy</button>
                </div>
              </div>

            </div>

            {/* 3️⃣ 右側專欄：Language & region / We're here to help (佔 1 欄) */}
            <div className="flex flex-col gap-[clamp(12px,2vh,24px)] h-full min-h-0">
              
              {/* Language & region */}
              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-around">
                <h3 className="font-mono text-[clamp(11px,1.3vh,14px)] font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 shrink-0">
                  <Globe className="w-4 h-4" /> Language & region
                </h3>
                <div className="flex flex-col justify-evenly flex-1 min-h-0 gap-2 mt-2">
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 group cursor-pointer transition-colors">
                    <div className="flex flex-col">
                      <span className="font-mono text-[clamp(11px,1.3vh,14px)] text-slate-700">English (American)</span>
                      <span className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-900 font-bold">Language</span>
                    </div>
                    <ArrowRightSquare className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 group cursor-pointer transition-colors">
                    <div className="flex flex-col">
                      <span className="font-mono text-[clamp(11px,1.3vh,14px)] text-slate-700">Taiwan (TWD $)</span>
                      <span className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-900 font-bold">Region</span>
                    </div>
                    <ArrowRightSquare className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* We're here to help */}
              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-between">
                <h3 className="font-mono text-[clamp(12px,1.4vh,16px)] font-bold text-slate-800 tracking-widest">
                  We're here to help
                </h3>
                <p className="font-mono text-[clamp(10px,1.2vh,12px)] text-slate-500 mt-2 flex-1">
                  Get in touch with our Global Customer Service team.
                </p>
                <div className="flex justify-end mt-4">
                  <button className="px-6 py-2 bg-white border border-slate-200 text-slate-800 font-mono text-[clamp(11px,1.3vh,14px)] font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm active:scale-95">
                    Contact Us
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* === 視圖 B：物流座標 (Address Book) === */}
        {activeView === 'address' && (
          <div className="glass-panel p-8 rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm h-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-8 duration-500 min-h-0">
            <MapPin className="w-12 h-12 text-cyan-500 mb-4 animate-bounce shrink-0" />
            <h2 className="text-[clamp(20px,2.5vh,28px)] font-serif font-bold text-slate-800 mb-2 shrink-0">Address Book System</h2>
            <p className="font-mono text-[clamp(12px,1.4vh,14px)] text-slate-500 mb-6 shrink-0">Preparing the spatial teleportation coordinates...</p>
            <button 
              onClick={() => setActiveView('overview')}
              className="px-6 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-mono font-bold text-[clamp(12px,1.4vh,14px)] hover:border-cyan-500 hover:text-cyan-600 transition-colors shrink-0"
            >
              Back to Overview
            </button>
          </div>
        )}

      </div>

    </div>
  );
}