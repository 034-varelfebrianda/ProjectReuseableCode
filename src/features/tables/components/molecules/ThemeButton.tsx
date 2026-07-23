import ThemeToggle from "../atoms/ThemeToggle";

interface GridTopBarProps {
  showThemeToggle?: boolean;
}

export default function ThemeButton({
  showThemeToggle = false,
}: GridTopBarProps) {
  return (
    <div className="theme-button">{showThemeToggle && <ThemeToggle />}</div>
  );
}
