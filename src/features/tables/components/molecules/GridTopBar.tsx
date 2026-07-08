import ThemeToggle from "../atoms/ThemeToggle";

interface GridTopBarProps {
  title?: string;
  showThemeToggle?: boolean;
}

export default function GridTopBar({ 
  title = "Large DataBase (Server Mode)", 
  showThemeToggle = false 
}: GridTopBarProps) {
  return (
    <div className="flex justify-between items-center pb-5">
      <p className="font-bold justify-start text-[24px] text-zinc-900 dark:text-zinc-100 transition-colors">
        {title}
      </p>

      {showThemeToggle && <ThemeToggle />}
    </div>
  );
}