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
    <div
      ref={popupRef}
      className="absolute -right-25 top-full mt-2 z-50  w-80 rounded-lg border border-theme-border bg-theme-bg-dropdown shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-theme-border px-4 py-3">
        <h3 className="text-sm font-semibold text-theme-text-primary">
          Filter: {columnLabel}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded hover:bg-theme-bg-row-hover p-1 text-theme-text-secondary"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3 max-h-96 overflow-y-auto">
        {/* Conditions */}
        {conditions.map((condition, index) => (
          <div key={index} className="space-y-2">
            {index > 0 && (
              <div className="text-xs font-medium text-theme-text-secondary">
                {logic}
              </div>
            )}
            <div className="flex gap-2 items-start">
              <select
                value={condition.operator}
                onChange={(e) =>
                  handleConditionChange(
                    index,
                    "operator",
                    e.target.value as FilterOperator
                  )
                }
                className="flex-1 px-2 py-1.5 text-sm border border-theme-border rounded bg-theme-bg-input text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                className="flex-1 px-2 py-1.5 text-sm border border-theme-border rounded bg-theme-bg-input text-theme-text-primary placeholder:text-theme-text-placeholder focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              {conditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(index)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add Condition Button */}
        <button
          type="button"
          onClick={handleAddCondition}
          className="flex items-center gap-1 text-xs font-medium text-theme-accent hover:opacity-80 mt-2"
        >
          <Plus size={14} />
          Add condition
        </button>

        {/* Logic Selector (show if multiple conditions) */}
        {conditions.length > 1 && (
          <div className="border-t border-theme-border pt-3 mt-3">
            <label className="text-xs font-medium text-theme-text-secondary block mb-2">
              Match
            </label>
            <div className="flex gap-2">
              {logicOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`logic-operator-${columnLabel.replace(/\s+/g, "-")}`}
                    value={opt.value}
                    checked={logic === opt.value}
                    onChange={(e) => setLogic(e.target.value as "AND" | "OR")}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-theme-text-primary">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 border-t border-theme-border px-4 py-3 bg-theme-bg-header/50">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-theme-text-secondary border border-theme-border rounded hover:bg-theme-bg-row-hover transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 px-3 py-1.5 text-sm font-medium bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
