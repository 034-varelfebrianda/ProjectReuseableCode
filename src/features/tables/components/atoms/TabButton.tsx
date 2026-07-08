interface TabButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function TabButton({
  label,
  active = false,
  onClick,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer relative px-5 py-3 text-sm font-medium transition-colors ${active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
        }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-500 transition-all" />
      )}
    </button>
  );
}