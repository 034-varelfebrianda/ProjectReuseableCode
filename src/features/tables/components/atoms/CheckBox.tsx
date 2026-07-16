import { Check } from "lucide-react";

interface CheckboxProps {
  checked?: boolean;
}

export default function Checkbox({ checked = false }: CheckboxProps) {
  return (
    <div
      className={`mx-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded border ${checked ? "border-theme-accent bg-theme-accent" : "border-theme-border bg-theme-bg-input"
        }`}
    >
      {checked && <Check size={14} className="text-theme-accent-text" strokeWidth={3} />}
    </div>
  );
}