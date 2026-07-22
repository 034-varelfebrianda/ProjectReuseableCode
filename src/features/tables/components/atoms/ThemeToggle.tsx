import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../../contexts/useTheme";
import { ThemeMode } from "../../../../types/enums";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export default function ThemeToggle({ className = "", size = "sm" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const buttonSize = size === "md" ? "theme-toggle-md" : "theme-toggle-sm";

  return (
    <div className={`theme-toggle ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setTheme(ThemeMode.LIGHT)}
        className={`theme-toggle-button ${buttonSize} ${theme === ThemeMode.LIGHT ? "active" : ""
          }`}
      >
        <Sun size={size === "md" ? 14 : 13} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme(ThemeMode.DARK)}
        className={`theme-toggle-button ${buttonSize} ${theme === ThemeMode.DARK ? "active" : ""
          }`}
      >
        <Moon size={size === "md" ? 14 : 13} />
        <span>Dark</span>
      </button>
    </div>
  );
}
