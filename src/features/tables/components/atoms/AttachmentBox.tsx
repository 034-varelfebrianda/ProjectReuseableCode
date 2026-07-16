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
        className="flex h-9 w-full items-center justify-between cursor-pointer rounded-md border border-theme-border bg-theme-bg-input px-3 text-sm text-theme-text-secondary transition hover:border-theme-text-secondary/50"
      >
        <span className="truncate">{selectedLabel}</span>
        <div className="flex items-center gap-2">
          <ChevronDown size={14} className="text-theme-text-secondary hover:text-theme-text-primary" />
          <div className="border-l h-6 border-theme-border" />
          <Funnel size={14} className="cursor-default text-theme-text-secondary hover:text-theme-text-primary" />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-full rounded-md border border-theme-border bg-theme-bg-dropdown shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full justify-between px-3 py-2 text-left text-sm text-theme-text-secondary hover:bg-theme-bg-row-hover"
            >
              <span>{option.label}</span>
              {option.value === value && <span className="text-theme-accent">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
