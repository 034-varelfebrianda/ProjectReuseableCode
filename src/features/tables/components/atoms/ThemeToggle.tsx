import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../../contexts/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-0.5 transition-colors">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium cursor-pointer transition-all duration-200 ${
          theme === "light"
            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
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
            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
        }`}
      >
        <Moon size={13} />
        <span>Dark</span>
      </button>
    </div>
  );
}
