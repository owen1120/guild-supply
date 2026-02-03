// src/components/ui/Switch.tsx
import { cn } from '../../utils/cn';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
}

export const Switch = ({ checked, onCheckedChange, id }: SwitchProps) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        // 膠囊外殼：寬 44px, 高 24px
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2",
        // 顏色邏輯：開 (Cyan-950/Glass), 關 (Slate-200)
        checked ? "bg-slate-900 border-slate-900" : "bg-slate-200 border-slate-200"
      )}
    >
      <span className="sr-only">Toggle Adventure Mode</span>
      <span
        className={cn(
          // 圓形按鈕：大小 20px
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          // 位置邏輯：開 (右移), 關 (左移)
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};