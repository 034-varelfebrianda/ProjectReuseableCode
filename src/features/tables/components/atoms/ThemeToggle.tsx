import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../../contexts/useTheme";

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
        onClick={() => setTheme("light")}
        className={`theme-toggle-button ${buttonSize} ${theme === "light" ? "active" : ""
          }`}
      >
        <Sun size={size === "md" ? 14 : 13} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`theme-toggle-button ${buttonSize} ${theme === "dark" ? "active" : ""
          }`}
      >
        <Moon size={size === "md" ? 14 : 13} />
        <span>Dark</span>
      </button>
    </div>
  );
}
