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
        className="flex h-9 w-full items-center justify-between cursor-pointer rounded-md border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 text-sm text-zinc-500 dark:text-zinc-400 transition hover:border-zinc-300 dark:hover:border-zinc-500"
      >
        <span className="truncate">{selectedLabel}</span>
        <div className="flex items-center gap-2">
          <ChevronDown size={14} className="text-[#71717A] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-zinc-200" />
          <div className="border-l h-6 border-zinc-200 dark:border-zinc-600" />
          <Funnel size={14} className="cursor-default text-[#71717A] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-zinc-200" />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full justify-between px-3 py-2 text-left text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
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
