import { useState } from "react";
import { ChevronDown, Funnel } from "lucide-react";

export type AttachmentValue = "all" | "yes" | "no";

interface AttachmentBoxProps {
  value: string;
  onChange: (value: AttachmentValue) => void;
}

const options: Array<{ value: AttachmentValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export default function AttachmentBox({
  value,
  onChange,
}: AttachmentBoxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((option) => option.value === value)?.label ?? "All"; 

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-full items-center justify-between cursor-pointer rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-500 transition hover:border-zinc-300"
      >
        <span className="truncate">{selectedLabel}</span>
        <div className="flex items-center gap-2">
          <ChevronDown size={14} className="text-[#71717A] hover:text-[#09090B]" />
          <div className="border-l h-6 border-zinc-200" />
          <Funnel size={14} className="cursor-default text-[#71717A] hover:text-[#09090B]" />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full justify-between px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-100 "
            >
              <span>{option.label}</span>
              {option.value === value && <span className="text-sky-500">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
