import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../../contexts/useTheme";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export default function ThemeToggle({ className = "", size = "sm" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const buttonSize = size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <div className={`flex items-center rounded-lg border border-theme-border bg-theme-bg-header p-0.5 transition-colors ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 rounded-md font-medium cursor-pointer transition-all duration-200 ${buttonSize} ${
          theme === "light"
            ? "bg-theme-bg-table text-theme-text-primary shadow-sm"
            : "text-theme-text-secondary hover:text-theme-text-primary"
        }`}
      >
        <Sun size={size === "md" ? 14 : 13} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 rounded-md font-medium cursor-pointer transition-all duration-200 ${buttonSize} ${
          theme === "dark"
            ? "bg-theme-bg-table text-theme-text-primary shadow-sm"
            : "text-theme-text-secondary hover:text-theme-text-primary"
        }`}
      >
        <Moon size={size === "md" ? 14 : 13} />
        <span>Dark</span>
      </button>
    </div>
  );
}
