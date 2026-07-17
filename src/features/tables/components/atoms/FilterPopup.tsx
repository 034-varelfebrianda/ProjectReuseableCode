import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";

export type FilterOperator = "contains" | "equals" | "startsWith" | "endsWith";

export interface FilterCondition {
  operator: FilterOperator;
  value: string;
}

export interface FilterState {
  conditions: FilterCondition[];
  logic: "AND" | "OR";
}

interface FilterPopupProps {
  columnLabel: string;
  initialState?: FilterState;
  onApply: (state: FilterState) => void;
  onClose: () => void;
}

const operatorOptions: Array<{ value: FilterOperator; label: string }> = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "startsWith", label: "Start With" },
  { value: "endsWith", label: "Ends With" },
];

const logicOptions = [
  { value: "AND" as const, label: "AND" },
  { value: "OR" as const, label: "OR" },
];

export default function FilterPopup({
  columnLabel,
  initialState,
  onApply,
  onClose,
}: FilterPopupProps) {
  const [conditions, setConditions] = useState<FilterCondition[]>(
    initialState?.conditions && initialState.conditions.length > 0
      ? initialState.conditions
      : [{ operator: "contains", value: "" }]
  );
  const [logic, setLogic] = useState<"AND" | "OR">(initialState?.logic ?? "AND");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleAddCondition = () => {
    setConditions([...conditions, { operator: "contains", value: "" }]);
  };

  const handleRemoveCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const handleConditionChange = (
    index: number,
    field: keyof FilterCondition,
    value: string
  ) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: value };
    setConditions(updated);
  };

  const handleApply = () => {
    const activeConditions = conditions.filter((c) => c.value.trim().length > 0);
    if (activeConditions.length === 0) {
      onApply({ conditions: [], logic });
    } else {
      onApply({ conditions: activeConditions, logic });
    }
    onClose();
  };

  const handleClear = () => {
    setConditions([{ operator: "contains", value: "" }]);
    setLogic("AND");
    onApply({ conditions: [], logic: "AND" });
    onClose();
  };

  return (
    <div ref={popupRef} className="filter-popup">
      {/* Header */}
      <div className="filter-popup-header">
        <h3 className="filter-popup-title">
          Filter: {columnLabel}
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="filter-popup-close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="filter-popup-content">
        {conditions.map((condition, index) => (
          <div key={index} className="filter-condition">
            {index > 0 && (
              <div className="filter-logic-label">
                {logic}
              </div>
            )}

            <div className="filter-condition-row">
              <select
                value={condition.operator}
                onChange={(e) =>
                  handleConditionChange(
                    index,
                    "operator",
                    e.target.value as FilterOperator
                  )
                }
                className="filter-input"
              >
                {operatorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={condition.value}
                onChange={(e) =>
                  handleConditionChange(index, "value", e.target.value)
                }
                placeholder="Value"
                className="filter-input"
              />

              {conditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(index)}
                  className="filter-remove-button"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddCondition}
          className="filter-add-button"
        >
          <Plus size={14} />
          Add condition
        </button>

        {conditions.length > 1 && (
          <div className="filter-logic-section">
            <label className="filter-match-label">
              Match
            </label>

            <div className="filter-radio-group">
              {logicOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="filter-radio-label"
                >
                  <input
                    type="radio"
                    name={`logic-operator-${columnLabel.replace(/\s+/g, "-")}`}
                    value={opt.value}
                    checked={logic === opt.value}
                    onChange={(e) => setLogic(e.target.value as "AND" | "OR")}
                  />

                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="filter-popup-footer">
        <button
          type="button"
          onClick={handleClear}
          className="filter-clear-button"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={handleApply}
          className="filter-apply-button"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
