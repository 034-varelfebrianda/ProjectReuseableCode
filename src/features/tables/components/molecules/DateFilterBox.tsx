import { useState } from "react";
import { Funnel } from "lucide-react";
import DateFilterPopup from "../atoms/DateFilterPopup";
import type { DateFilterState } from "../../utils/types";

interface DateFilterBoxProps<T> {
  columnLabel: string;
  columnKey: keyof T & string;
  data: T[];
  filterState?: DateFilterState;
  onFilterApply: (state: DateFilterState | undefined) => void;
  placeholder?: string;
}

export default function DateFilterBox<T>({
  columnLabel,
  columnKey,
  data,
  filterState,
  onFilterApply,
  placeholder = "Filter date...",
}: DateFilterBoxProps<T>) {
  const [showPopup, setShowPopup] = useState(false);

  const hasActiveFilter =
    filterState &&
    filterState.type === "date_tree" &&
    filterState.selectedDates &&
    filterState.selectedDates.length > 0;

  const displayValue = hasActiveFilter
    ? `Filtered (${filterState.selectedDates.length} dates)`
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
            title="Filter by Date"
          >
            <Funnel size={14} />
          </button>

          {showPopup && (
            <DateFilterPopup
              columnLabel={columnLabel}
              data={data}
              columnKey={columnKey}
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
