import { cn } from '../../utils/cn';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = ({ checked, onCheckedChange }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        // 外殼：寬 44px (w-11), 高 24px (h-6)
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        // 顏色邏輯：
        // 開 (Checked): 深色背景 (Slate-900)
        // 關 (Unchecked): 淺灰背景 (Slate-200)
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span className="sr-only">Toggle Adventure Mode</span>
      <span
        className={cn(
          // 圓形按鈕：大小 20px (h-5 w-5)
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          // 位置移動：
          // 開: 往右移 translate-x-5
          // 關: 原地 translate-x-0
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};