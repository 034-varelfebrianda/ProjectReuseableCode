import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface SortIconProps {
  active: boolean;
  direction?: "asc" | "desc";
}

export default function SortIcon({ active, direction = "asc" }: SortIconProps) {
  if (!active) {
    return <ChevronsUpDown size={14} className="text-zinc-400 opacity-50 transition-opacity" />;
  }

  return direction === "asc" ? (
    <ChevronUp size={14} className="text-sky-500 font-bold" />
  ) : (
    <ChevronDown size={14} className="text-sky-500 font-bold" />
  );
}
