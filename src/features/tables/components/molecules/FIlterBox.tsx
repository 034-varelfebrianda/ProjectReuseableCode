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
    <div className="filter-box">
      <input
        className={`filter-box-input ${hasActiveFilter ? "active" : ""
          }`}
        value={getDisplayValue()}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={!!hasActiveFilter}
      />

      <div className="filter-box-actions">
        {attachmentBox && (
          <>
            <div className="filter-box-divider-full" />

            <ChevronDown
              size={14}
              className="filter-box-icon"
            />
          </>
        )}

        <div className="filter-box-divider" />

        <div className="filter-box-popup">
          <button
            type="button"
            onClick={() => setShowPopup((prev) => !prev)}
            className={`filter-box-filter-button ${hasActiveFilter ? "active" : ""
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
