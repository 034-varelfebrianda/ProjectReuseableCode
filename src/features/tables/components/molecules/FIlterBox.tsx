import { ChangeEvent, useState } from "react";
import { ChevronDown, Funnel } from "lucide-react";
import FilterPopup, { type FilterState } from "../atoms/FilterPopup";

export type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith";

interface FilterBoxProps {
  attachmentBox?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  columnLabel?: string;
  onFilterApply?: (state: FilterState) => void;
  initialFilterState?: FilterState;
}

export default function FilterBox({
  attachmentBox = false,
  value,
  onChange,
  placeholder = "",
  columnLabel = "Column",
  onFilterApply,
  initialFilterState,
}: FilterBoxProps) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [showPopup, setShowPopup] = useState(false);
  const [filterState, setFilterState] = useState<FilterState | undefined>(
    initialFilterState
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    if (onChange) {
      onChange(nextValue);
    } else {
      setInternalValue(nextValue);
    }
  };

  const handleFilterApply = (state: FilterState) => {
    setFilterState(state);
    if (onFilterApply) {
      onFilterApply(state);
    }
    setShowPopup(false);
  };

  const hasActiveFilter =
    filterState && filterState.conditions.length > 0 && filterState.conditions.some((c) => c.value.trim().length > 0);

  return (
    <div className="flex h-9 items-center rounded-md border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 transition-colors relative">
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
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setShowPopup((prev) => !prev)}
            className={`flex items-center justify-center p-1 rounded transition-colors cursor-pointer ${hasActiveFilter
              ? "text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900/30"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            title="Advanced Filter"
          >
            <Funnel size={14} />
          </button>

          {showPopup && (
            <FilterPopup
              columnLabel={columnLabel}
              initialState={filterState}
              onApply={handleFilterApply}
              onClose={() => setShowPopup(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
