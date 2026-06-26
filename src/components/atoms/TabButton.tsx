interface TabButtonProps {
  label: string;
  active?: boolean;
}

export default function TabButton({
  label,
  active = false,
}: TabButtonProps) {
  return (
    <button
      className={`relative px-5 py-3 text-sm font-medium ${
        active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-500" />
      )}
    </button>
  );
}