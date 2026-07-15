import ThemeToggle from "../atoms/ThemeToggle";

interface GridTopBarProps {
  showThemeToggle?: boolean;
}

export default function ThemeButton({
  showThemeToggle = false
}: GridTopBarProps) {
  return (
    <div className="flex justify-end items-center pb-5">
      {showThemeToggle && <ThemeToggle />}
    </div>
  );
}