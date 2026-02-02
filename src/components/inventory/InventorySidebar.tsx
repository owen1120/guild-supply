import { FilterSection } from './FilterSection';

export const InventorySidebar = () => {
  return (
    <aside className="w-64 hidden xl:flex flex-col gap-4 animate-fade-in-up">
      {/* 這些是根據你的設計圖模仿的 */}
      <FilterSection label="CATEGORY" />
      <FilterSection label="ACTIVITY" />
      <FilterSection label="FUNCTION & TECH" />
      <FilterSection label="BRAND" />
      <FilterSection label="SPECIFICATIONS" />
    </aside>
  );
};