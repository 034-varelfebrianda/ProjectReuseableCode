import { useState } from "react";
import { Funnel } from "lucide-react";
import GenericTreeFilterPopup from "../atoms/GenericTreeFilterPopup";
import type { TreeFilterState, DateFilterState } from "../../utils/types";

interface GenericFilterBoxProps<T> {
  columnLabel: string;
  columnKey: keyof T & string;
  data: T[];
  filterType?: "text" | "select" | "date" | "number" | "none";
  filterOptions?: Array<{ value: string; label: string }>;
  filterState?: TreeFilterState | DateFilterState;
  onFilterApply: (state: TreeFilterState | undefined) => void;
  placeholder?: string;
}

export default function GenericFilterBox<T>({
  columnLabel,
  columnKey,
  data,
  filterType = "text",
  filterOptions,
  filterState,
  onFilterApply,
  placeholder = "Filter...",
}: GenericFilterBoxProps<T>) {
  const [showPopup, setShowPopup] = useState(false);

  const getActiveFilterCount = (): number => {
    if (!filterState) return 0;
    if ("selectedValues" in filterState && filterState.selectedValues) {
      return filterState.selectedValues.length;
    }
    if ("selectedDates" in filterState && filterState.selectedDates) {
      return filterState.selectedDates.length;
    }
    return 0;
  };

  const activeCount = getActiveFilterCount();
  const hasActiveFilter = activeCount > 0;

  const displayValue = hasActiveFilter
    ? `Filtered (${activeCount} items)`
    : "";

  return (
    <div className="filter-box">
      <input
        className={`filter-box-input ${hasActiveFilter ? "active" : ""}`}
        value={displayValue}
        readOnly
        placeholder={placeholder}
        onClick={() => setShowPopup((prev) => !prev)}
      />

      <div className="filter-box-actions">
        <div className="filter-box-divider" />

        <div className="filter-box-popup">
          <button
            type="button"
            onClick={() => setShowPopup((prev) => !prev)}
            className={`filter-box-filter-button ${hasActiveFilter ? "active" : ""}`}
            title={`Filter ${columnLabel}`}
          >
            <Funnel size={14} />
          </button>

          {showPopup && (
            <GenericTreeFilterPopup
              columnLabel={columnLabel}
              columnKey={columnKey}
              data={data}
              filterType={filterType}
              filterOptions={filterOptions}
              initialState={filterState}
              onApply={(state) => {
                onFilterApply(state);
                setShowPopup(false);
              }}
              onClose={() => setShowPopup(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
