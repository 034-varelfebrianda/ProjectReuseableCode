import { Check } from "lucide-react";

interface CheckboxProps {
  checked?: boolean;
}

export default function Checkbox({ checked = false }: CheckboxProps) {
  return (
    <div className={`custom-checkbox ${checked ? "checked" : ""}`}>
      {checked && (
        <Check size={14} className="custom-checkbox-icon" strokeWidth={3} />
      )}
    </div>
  );
}
