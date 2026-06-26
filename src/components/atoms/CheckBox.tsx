import { Check } from "lucide-react";

interface CheckboxProps {
  checked?: boolean;
}

export default function Checkbox({
  checked = false 
  }: CheckboxProps) {
  return (
    <div
      className={`mx-auto flex h-5 w-5 items-center justify-center rounded border ${
        checked ? "border-[#0EA5E9] bg-[#0EA5E9]" : "border-zinc-300 bg-white"
      }`}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </div>
  );
}