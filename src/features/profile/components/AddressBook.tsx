// src/features/profile/components/AddressBook.tsx
import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Star, X, Save, Loader2, Check } from 'lucide-react';
import { useProfileStore } from '../store/useProfileStore';
import type { Address, CreateAddressPayload } from '../services/addressService';

export default function AddressBook() {
  const { addresses, isLoading, createAddress, updateAddress, deleteAddress } = useProfileStore();
  
  // 💎 控制目前是「列表模式」還是「編輯/新增模式」
  const [isEditing, setIsEditing] = useState(false);
  
  // 💎 存放表單資料，如果為 null 代表是新增，有值代表是編輯
  const [formData, setFormData] = useState<Partial<Address> | null>(null);

  // 開啟新增表單
  const handleAddNew = () => {
    setFormData({
      recipient: '', phone: '', city: '', district: '', detail: '', isDefault: false
    });
    setIsEditing(true);
  };

  // 開啟編輯表單
  const handleEdit = (address: Address) => {
    setFormData(address);
    setIsEditing(true);
  };

  // 儲存魔法 (送出表單)
  const handleSave = async () => {
    if (!formData || !formData.recipient || !formData.city || !formData.detail) {
      alert("Please fill in all required spatial coordinates (Recipient, City, Detail).");
      return;
    }

    try {
      if (formData.id) {
        // 更新現有地址
        await updateAddress(formData.id, formData as CreateAddressPayload);
      } else {
        // 新增地址
        await createAddress(formData as CreateAddressPayload);
      }
      setIsEditing(false); // 儲存成功後返回列表
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("The spatial magic fluctuated. Failed to save coordinates.");
    }
  };

  // 刪除魔法
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete these coordinates?")) {
      try {
        await deleteAddress(id);
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    }
  };

  // ==========================================
  //  視圖 A：📝 表單模式 (新增/編輯)
  // ==========================================
  if (isEditing && formData) {
    return (
      <div className="glass-panel p-[clamp(16px,3vh,32px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm h-full flex flex-col animate-in fade-in zoom-in-95 duration-300 min-h-0">
        <div className="flex items-center justify-between mb-[clamp(16px,2vh,24px)] shrink-0">
          <h2 className="text-[clamp(18px,2.2vh,24px)] font-serif font-bold text-slate-800 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-cyan-500" />
            {formData.id ? 'Edit Coordinates' : 'New Teleportation Coordinates'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表單內容區塊 (內部可捲動，不影響外部) */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-[clamp(12px,1.5vh,16px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-[clamp(12px,1.5vh,16px)]">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs font-bold text-slate-600">Recipient Name</label>
              <input type="text" value={formData.recipient || ''} onChange={e => setFormData({...formData, recipient: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-sm text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" placeholder="e.g. Gon Freecss" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs font-bold text-slate-600">Phone Number</label>
              <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-sm text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" placeholder="e.g. 0912345678" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs font-bold text-slate-600">City</label>
              <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-sm text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" placeholder="e.g. Yorknew City" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs font-bold text-slate-600">District</label>
              <input type="text" value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-sm text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" placeholder="e.g. Central District" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-mono text-xs font-bold text-slate-600">Detailed Address</label>
              <input type="text" value={formData.detail || ''} onChange={e => setFormData({...formData, detail: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-[clamp(8px,1vh,12px)] font-mono text-sm text-slate-800 focus:outline-none focus:border-cyan-400 transition-all" placeholder="e.g. Greed Island Avenue 44" />
            </div>
          </div>

          <label className="flex items-center gap-3 mt-2 cursor-pointer group w-fit">
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${formData.isDefault ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-slate-300 text-transparent group-hover:border-cyan-400'}`}>
              <Check className="w-3 h-3" />
            </div>
            <input type="checkbox" checked={formData.isDefault || false} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="hidden" />
            <span className="font-mono text-sm text-slate-700 font-bold">Set as Default Logistics Target</span>
          </label>
        </div>

        {/* 表單按鈕區塊 */}
        <div className="shrink-0 pt-[clamp(16px,2vh,24px)] flex justify-end gap-3 mt-auto border-t border-slate-200/50">
          <button onClick={() => setIsEditing(false)} disabled={isLoading} className="px-6 py-[clamp(8px,1vh,10px)] rounded-xl text-slate-500 font-mono text-sm font-bold hover:bg-slate-100 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isLoading} className="px-6 py-[clamp(8px,1vh,10px)] bg-cyan-500 text-white font-mono text-sm font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Coordinates
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  //  視圖 B：📍 列表模式 (預設畫面)
  // ==========================================
  return (
    <div className="glass-panel p-[clamp(16px,3vh,32px)] rounded-[clamp(16px,2vh,32px)] border border-white/60 shadow-sm h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 min-h-0">
      
      {/* 頂部標題與新增按鈕 */}
      <div className="flex items-center justify-between mb-[clamp(16px,2vh,24px)] shrink-0">
        <div>
          <h2 className="text-[clamp(20px,2.5vh,28px)] font-serif font-bold text-slate-800 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-cyan-500" />
            Address Book
          </h2>
          <p className="font-mono text-[clamp(10px,1.2vh,12px)] text-slate-500 mt-1">Manage your spatial teleportation targets.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-slate-900 text-white font-mono text-[clamp(11px,1.3vh,14px)] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* 地址列表清單 (內部可捲動) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-[clamp(12px,1.5vh,16px)]">
        
        {/* Loading 狀態 */}
        {isLoading && addresses.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        )}

        {/* 空狀態 */}
        {!isLoading && addresses.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl p-8">
            <MapPin className="w-12 h-12 text-slate-300 mb-4" />
            <p className="font-mono text-sm mb-4 text-center">No coordinates registered yet.<br/>The guild owls don't know where to find you!</p>
            <button onClick={handleAddNew} className="text-cyan-600 font-bold font-mono text-sm hover:underline">
              Establish Coordinates Now
            </button>
          </div>
        )}

        {/* 地址卡片 */}
        {addresses.map((address) => (
          <div key={address.id} className={`p-[clamp(16px,2vh,24px)] rounded-2xl border ${address.isDefault ? 'border-cyan-400 bg-cyan-50/30' : 'border-slate-200 bg-white/50'} flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:shadow-md transition-shadow group shrink-0`}>
            
            {/* 地址資訊 */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-serif font-bold text-slate-800 text-[clamp(14px,1.8vh,18px)] truncate">{address.recipient}</h3>
                {address.isDefault && (
                  <span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Star className="w-3 h-3" /> DEFAULT
                  </span>
                )}
              </div>
              <p className="font-mono text-[clamp(12px,1.4vh,14px)] text-slate-600">{address.phone}</p>
              <p className="font-mono text-[clamp(11px,1.3vh,14px)] text-slate-500 truncate mt-1">
                {address.city} {address.district} {address.detail}
              </p>
            </div>

            {/* 操作按鈕 */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button onClick={() => handleEdit(address)} disabled={isLoading} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors disabled:opacity-50" title="Edit">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(address.id)} disabled={isLoading} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}