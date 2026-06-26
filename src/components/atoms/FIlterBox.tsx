import { ChevronDown, Funnel } from "lucide-react";

interface FilterBoxProps {
  withDropdown?: boolean;
}

export default function FilterBox({
  withDropdown = false,
}: FilterBoxProps) {
  return (
    <div className="flex h-9 items-center justify-between rounded-md border border-zinc-200 bg-white px-2 cursor-text">
      <div />
      
      <div className="flex items-center gap-2">
        {withDropdown && <div className="h-9 border-l text-zinc-200"/>}
        {withDropdown && <ChevronDown size={14} className="cursor-pointer text-[#71717A]" />}
        
        <div className="h-9 border-l border-zinc-200" />
        
        <Funnel size={14} className="cursor-pointer text-[#71717A]" />
      </div>
    </div>
  );
}