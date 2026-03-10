import { useState, useEffect } from 'react';
import { 
  Swords, Shield, HelpCircle, 
  MapPin, ShoppingBag, CreditCard, MessageCircle, ChevronRight, Loader2, Globe, RefreshCcw, Star, UserCircle
} from 'lucide-react';
import { useProfileStore } from '../features/profile/store/useProfileStore';
import AddressBook from '../features/profile/components/AddressBook';

type DashboardView = 'overview' | 'address' | 'orders' | 'profile-edit' | 'rank-info' | 'credits';

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
        
        <div className="text-center pb-[clamp(4px,1vh,16px)] pt-[clamp(4px,1vh,8px)] relative">
           {activeView !== 'overview' && (
             <button 
               onClick={() => setActiveView('overview')}
               className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 hover:text-cyan-500 transition-colors font-mono text-[clamp(10px,1.2vh,12px)] z-10"
             >
               <ChevronRight className="w-4 h-4 rotate-180" /> Back to Overview
             </button>
           )}
          <h2 className="text-[clamp(24px,4vh,48px)] font-serif font-bold text-slate-900 tracking-widest uppercase leading-none">
            Hero's License
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[clamp(8px,1.5vh,16px)]">
          
          <div 
            onClick={() => setActiveView('profile-edit')}
            className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex items-center gap-[clamp(12px,1.5vw,24px)] border border-white/60 shadow-sm hover:shadow-cyan-500/10 hover:border-cyan-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-[clamp(48px,6vh,64px)] h-[clamp(48px,6vh,64px)] bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-cyan-50 transition-colors">
              <Swords className="w-1/2 h-1/2 text-slate-700 group-hover:text-cyan-600 transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[clamp(10px,1.2vh,14px)] text-slate-500 font-bold mb-1">Lv.{profile?.level || 1}</p>
              <h3 className="font-serif text-[clamp(16px,2vh,24px)] font-bold text-slate-900 uppercase truncate group-hover:text-cyan-700 transition-colors">
                {profile?.firstName || profile?.realName || 'Adventurer'}
              </h3>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('rank-info')}
            className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex flex-col justify-center border border-white/60 shadow-sm hover:shadow-cyan-500/10 hover:border-cyan-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <h3 className="font-serif text-[clamp(14px,1.8vh,20px)] font-bold text-slate-900 uppercase mb-[clamp(4px,0.5vh,8px)] truncate group-hover:text-cyan-700 transition-colors">
              {profile?.rankTitle || 'BRONZE MEMBER'}
            </h3>
            <p className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-500 truncate">Your progress & rewards</p>
          </div>

          <div 
            onClick={() => setActiveView('orders')}
            className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex flex-col justify-center border border-white/60 shadow-sm hover:shadow-cyan-500/10 hover:border-cyan-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <p className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-500 font-bold uppercase tracking-widest mb-[clamp(4px,0.5vh,8px)]">Active</p>
            <h3 className="font-sans text-[clamp(24px,3vh,36px)] font-bold text-slate-800 leading-none group-hover:text-cyan-600 transition-colors">3</h3>
          </div>

          <div 
            onClick={() => setActiveView('credits')}
            className="glass-panel p-[clamp(12px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] flex flex-col justify-center border border-white/60 shadow-sm hover:shadow-cyan-500/10 hover:border-cyan-200 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <p className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-500 font-bold uppercase tracking-widest mb-[clamp(4px,0.5vh,8px)]">Credits</p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-sans text-[clamp(24px,3vh,36px)] font-bold text-slate-800 leading-none truncate group-hover:text-cyan-600 transition-colors">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-[clamp(12px,2vh,24px)] h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 左側大區塊：個人細節表單 */}
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

            {/* 中間專欄：My Account & Support */}
            <div className="flex flex-col gap-[clamp(12px,2vh,24px)] h-full min-h-0">
              
              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-around">
                <h3 className="font-mono text-[clamp(11px,1.3vh,14px)] font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 shrink-0">
                  <Shield className="w-4 h-4" /> My account
                </h3>
                <div className="flex flex-col justify-evenly flex-1 min-h-0">
                  <button onClick={() => setActiveView('orders')} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><ShoppingBag className="w-4 h-4 shrink-0" /> <span className="truncate">Orders & returns</span></span>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                  <button className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><CreditCard className="w-4 h-4 shrink-0" /> <span className="truncate">Payment</span></span>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                  <button onClick={() => setActiveView('credits')} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><RefreshCcw className="w-4 h-4 shrink-0" /> <span className="truncate">Credits & Refunds</span></span>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                  <button onClick={() => setActiveView('address')} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><MapPin className="w-4 h-4 shrink-0" /> <span className="truncate">Address book</span></span>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                  <button className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left group">
                    <span className="flex items-center gap-3"><MessageCircle className="w-4 h-4 shrink-0" /> <span className="truncate">Communication</span></span>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                  </button>
                </div>
              </div>

              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-around">
                <h3 className="font-mono text-[clamp(11px,1.3vh,14px)] font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 shrink-0">
                  <HelpCircle className="w-4 h-4" /> Support
                </h3>
                <div className="flex flex-col justify-evenly flex-1 min-h-0">
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left truncate">About GUILD SUPPLY</button>
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left truncate">Terms & conditions</button>
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left truncate">Privacy policy</button>
                  <button className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors text-[clamp(11px,1.3vh,14px)] font-mono text-left truncate">FAQs & guides</button>
                </div>
              </div>

            </div>

            {/* 右側專欄：Language & region / We're here to help */}
            <div className="flex flex-col gap-[clamp(12px,2vh,24px)] h-full min-h-0">
              
              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-around">
                <h3 className="font-mono text-[clamp(11px,1.3vh,14px)] font-bold text-slate-800 tracking-widest uppercase flex items-center gap-2 shrink-0">
                  <Globe className="w-4 h-4" /> Language & region
                </h3>
                <div className="flex flex-col justify-evenly flex-1 min-h-0 gap-2 mt-2">
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 group cursor-pointer transition-colors">
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[clamp(11px,1.3vh,14px)] text-slate-700 truncate">English (American)</span>
                      <span className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-900 font-bold">Language</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 group cursor-pointer transition-colors">
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[clamp(11px,1.3vh,14px)] text-slate-700 truncate">Taiwan (TWD $)</span>
                      <span className="font-mono text-[clamp(9px,1.1vh,12px)] text-slate-900 font-bold">Region</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0" />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-[clamp(16px,2vh,24px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm flex-1 flex flex-col min-h-0 justify-between">
                <h3 className="font-mono text-[clamp(12px,1.4vh,16px)] font-bold text-slate-800 tracking-widest shrink-0">
                  We're here to help
                </h3>
                <p className="font-mono text-[clamp(10px,1.2vh,12px)] text-slate-500 mt-2 flex-1 min-h-0 overflow-hidden">
                  Get in touch with our Global Customer Service team.
                </p>
                <div className="flex justify-end mt-4 shrink-0">
                  <button className="px-6 py-2 bg-white border border-slate-200 text-slate-800 font-mono text-[clamp(11px,1.3vh,14px)] font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm active:scale-95">
                    Contact Us
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================= */}
        {/* 🛠️ 其他預備施工大廳 & 💎 替換上場的 AddressBook 元件         */}
        {/* ======================================================= */}

        {/* 視圖：編輯個人資料 (Profile Edit) */}
        {activeView === 'profile-edit' && (
          <div className="glass-panel p-8 rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm h-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-8 duration-500 min-h-0">
            <UserCircle className="w-12 h-12 text-cyan-500 mb-4 animate-pulse shrink-0" />
            <h2 className="text-[clamp(20px,2.5vh,28px)] font-serif font-bold text-slate-800 mb-2 shrink-0">Avatar & Profile Editor</h2>
            <p className="font-mono text-[clamp(12px,1.4vh,14px)] text-slate-500 mb-6 shrink-0">Preparing the soul recalibration chamber...</p>
          </div>
        )}

        {/* 視圖：公會階級 (Rank Info) */}
        {activeView === 'rank-info' && (
          <div className="glass-panel p-8 rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm h-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-8 duration-500 min-h-0">
            <Star className="w-12 h-12 text-cyan-500 mb-4 animate-pulse shrink-0" />
            <h2 className="text-[clamp(20px,2.5vh,28px)] font-serif font-bold text-slate-800 mb-2 shrink-0">Guild Rank & Benefits</h2>
            <p className="font-mono text-[clamp(12px,1.4vh,14px)] text-slate-500 mb-6 shrink-0">Fetching your honorable achievements and upcoming rewards...</p>
          </div>
        )}

        {/* 視圖：進行中的訂單 (Orders) */}
        {activeView === 'orders' && (
          <div className="glass-panel p-8 rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm h-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-8 duration-500 min-h-0">
            <ShoppingBag className="w-12 h-12 text-cyan-500 mb-4 animate-bounce shrink-0" />
            <h2 className="text-[clamp(20px,2.5vh,28px)] font-serif font-bold text-slate-800 mb-2 shrink-0">Active Orders & Returns</h2>
            <p className="font-mono text-[clamp(12px,1.4vh,14px)] text-slate-500 mb-6 shrink-0">Tracking your ongoing logistics...</p>
          </div>
        )}

        {/* 視圖：點數與退款 (Credits) */}
        {activeView === 'credits' && (
          <div className="glass-panel p-8 rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm h-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-8 duration-500 min-h-0">
            <RefreshCcw className="w-12 h-12 text-cyan-500 mb-4 animate-spin-slow shrink-0" />
            <h2 className="text-[clamp(20px,2.5vh,28px)] font-serif font-bold text-slate-800 mb-2 shrink-0">Credits & Refunds Center</h2>
            <p className="font-mono text-[clamp(12px,1.4vh,14px)] text-slate-500 mb-6 shrink-0">Accessing your guild treasury...</p>
          </div>
        )}

        {/* 視圖：物流座標 (Address Book) */}
        {activeView === 'address' && (
          <div className="h-full w-full min-h-0 relative animate-in fade-in slide-in-from-right-8 duration-500">
            <AddressBook />
          </div>
        )}

      </div>

    </div>
  );
}