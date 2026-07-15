import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../../contexts/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-lg border border-theme-border bg-theme-bg-header p-0.5 transition-colors">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all duration-200 ${
          theme === "light"
            ? "bg-theme-bg-table text-theme-text-primary shadow-sm"
            : "text-theme-text-secondary hover:text-theme-text-primary"
        }`}
      >
        <Sun size={13} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all duration-200 ${
          theme === "dark"
            ? "bg-theme-bg-table text-theme-text-primary shadow-sm"
            : "text-theme-text-secondary hover:text-theme-text-primary"
        }`}
      >
        <Moon size={13} />
        <span>Dark</span>
      </button>
    </div>
  );
}
