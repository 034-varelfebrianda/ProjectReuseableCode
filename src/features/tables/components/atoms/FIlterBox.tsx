import { ChangeEvent, useState } from "react";
import { ChevronDown, Funnel } from "lucide-react";

export type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith";

interface FilterBoxProps {
  attachmentBox?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  operator?: FilterOperator;
  onOperatorChange?: (operator: FilterOperator) => void;
}

export default function FilterBox({
  attachmentBox = false,
  value,
  onChange,
  placeholder = "",
}: FilterBoxProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    if (onChange) {
      onChange(nextValue);
    } else {
      setInternalValue(nextValue);
    }
  };

  return (
    <div className="flex h-9 items-center rounded-md border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 transition-colors">
      <input
        className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-200 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        value={onChange ? value ?? "" : internalValue}
        onChange={handleChange}
        placeholder={placeholder}
      />

      <div className="flex items-center gap-2">
        {attachmentBox && <div className="h-9 border-zinc-200 dark:border-zinc-600" />}
        {attachmentBox && (
          <ChevronDown
            size={14}
            className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 text-zinc-500 dark:text-zinc-400"
          />
        )}

        <div className="border-l h-6 border-zinc-200 dark:border-zinc-600" />
        <div className="flex items-center">
          <div className="flex items-center justify-center p-1 rounded text-zinc-500 dark:text-zinc-400">
            <Funnel size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
