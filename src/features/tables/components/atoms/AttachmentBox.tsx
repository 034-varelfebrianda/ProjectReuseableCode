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

export default function AttachmentBox({ value, onChange }: AttachmentBoxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "All";

  return (
    <div className="filter-select">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="filter-select-button"
      >
        <span className="filter-select-label">{selectedLabel}</span>

        <div className="filter-select-icons">
          <ChevronDown size={14} className="filter-select-icon" />

          <div className="filter-select-divider" />

          <Funnel
            size={14}
            className="filter-select-icon filter-select-icon-static"
          />
        </div>
      </button>

      {open && (
        <div className="filter-select-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="filter-select-option"
            >
              <span>{option.label}</span>

              {option.value === value && (
                <span className="filter-select-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
