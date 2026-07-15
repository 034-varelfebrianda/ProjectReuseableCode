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

  const getDisplayValue = () => {
    if (hasActiveFilter && filterState) {
      const active = filterState.conditions.filter((c) => c.value.trim().length > 0);
      if (active.length === 1) {
        const op = active[0].operator;
        const opLabel =
          op === "contains"
            ? "Contains"
            : op === "equals"
              ? "Equals"
              : op === "startsWith"
                ? "Starts with"
                : "Ends with";
        return `${opLabel}: ${active[0].value}`;
      } else if (active.length > 1) {
        return `(${active.length}) filters [${filterState.logic}]`;
      }
    }
    return onChange ? value ?? "" : internalValue;
  };

  return (
    <div className="flex h-9 items-center rounded-md border border-theme-border bg-theme-bg-input px-2 transition-colors relative">
      <input
        className={`w-full bg-transparent text-sm text-theme-text-primary outline-none placeholder:text-theme-text-placeholder ${hasActiveFilter ? "text-sky-600 font-medium cursor-not-allowed" : ""
          }`}
        value={getDisplayValue()}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={!!hasActiveFilter}
      />

      <div className="flex items-center gap-2">
        {attachmentBox && <div className="h-9 border-theme-border" />}
        {attachmentBox && (
          <ChevronDown
            size={14}
            className="cursor-pointer hover:text-theme-text-primary text-theme-text-secondary"
          />
        )}

        <div className="border-l h-6 border-theme-border" />
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setShowPopup((prev) => !prev)}
            className={`flex items-center justify-center p-1 rounded transition-colors cursor-pointer ${hasActiveFilter
              ? "text-theme-accent hover:bg-theme-accent-filter-bg"
              : "text-theme-text-secondary hover:bg-theme-bg-row-hover"
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
