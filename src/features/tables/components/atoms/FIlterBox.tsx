import { ChangeEvent, useState, useEffect, useRef } from "react";
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

const operatorOptions: Array<{ value: FilterOperator; label: string }> = [
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Start With" },
  { value: "endsWith", label: "Ends With" },
];

export default function FilterBox({
  attachmentBox = false,
  value,
  onChange,
  placeholder = "",
  operator,
  onOperatorChange,
}: FilterBoxProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [localOperator, setLocalOperator] = useState<FilterOperator>("contains");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentOperator = operator ?? localOperator;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    if (onChange) {
      onChange(nextValue);
    } else {
      setInternalValue(nextValue);
    }
  };

  const handleOperatorChange = (op: FilterOperator) => {
    if (onOperatorChange) {
      onOperatorChange(op);
    } else {
      setLocalOperator(op);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-9 items-center rounded-md border border-zinc-200 bg-white px-2">
      <input
        className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        value={onChange ? value ?? "" : internalValue}
        onChange={handleChange}
        placeholder={placeholder}
      />

      <div className="flex items-center gap-2">
        {attachmentBox && <div className="h-9 border-zinc-200" />}
        {attachmentBox && (
          <ChevronDown
            size={14}
            className="cursor-pointer hover:text-zinc-900 text-zinc-500"
          />
        )}

        <div className="border-l h-6 border-zinc-200" />
        <div className="relative flex items-center" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`flex items-center justify-center p-1 rounded hover:bg-zinc-100 transition-colors cursor-pointer ${currentOperator !== "contains"
                ? "text-sky-500"
                : "text-zinc-500 hover:text-zinc-900"
              }`}
            title={`Pilihan Operator: ${currentOperator}`}
          >
            <Funnel size={14} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2.5 z-50 w-48 rounded-md border border-zinc-200 bg-white shadow-lg py-1">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 uppercase border-b border-zinc-100 mb-1">
                Filter Operator
              </div>
              {operatorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    handleOperatorChange(opt.value);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left cursor-pointer ${currentOperator === opt.value
                      ? "text-sky-600 bg-sky-50 font-medium"
                      : "text-zinc-600 hover:bg-zinc-100"
                    }`}
                >
                  <span>{opt.label}</span>
                  {currentOperator === opt.value && <span className="ml-auto text-sky-500">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
