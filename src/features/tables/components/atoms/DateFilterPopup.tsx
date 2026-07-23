import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronRight, ChevronDown, Search, X, Check, Minus } from "lucide-react";
import type { DateFilterState } from "../../utils/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export interface DateTreeNode {
  id: string; // "2025", "2025-01", "2025-01-15"
  label: string;
  level: "year" | "month" | "day";
  children?: DateTreeNode[];
  dateStr?: string; // "YYYY-MM-DD"
}

interface DateFilterPopupProps<T> {
  columnLabel: string;
  data: T[];
  columnKey: keyof T & string;
  initialState?: DateFilterState;
  onApply: (state: DateFilterState | undefined) => void;
  onClose: () => void;
}

export function parseRowDate(val: unknown): { year: string; month: string; day: string; dateStr: string } | null {
  if (!val) return null;
  const d = new Date(val as string | number | Date);
  if (isNaN(d.getTime())) return null;

  const year = d.getFullYear().toString();
  const monthNum = String(d.getMonth() + 1).padStart(2, "0");
  const dayNum = String(d.getDate()).padStart(2, "0");

  const month = `${year}-${monthNum}`;
  const dateStr = `${year}-${monthNum}-${dayNum}`;

  return { year, month, day: dateStr, dateStr };
}

export function buildDateTree<T>(data: T[], columnKey: keyof T & string): DateTreeNode[] {
  const yearsMap = new Map<string, Map<string, Set<string>>>();

  data.forEach((item) => {
    const rawVal = item[columnKey];
    const parsed = parseRowDate(rawVal);
    if (!parsed) return;

    const { year, month, dateStr } = parsed;
    if (!yearsMap.has(year)) {
      yearsMap.set(year, new Map());
    }
    const monthsMap = yearsMap.get(year)!;
    if (!monthsMap.has(month)) {
      monthsMap.set(month, new Set());
    }
    monthsMap.get(month)!.add(dateStr);
  });

  const sortedYears = Array.from(yearsMap.keys()).sort((a, b) => b.localeCompare(a));

  const tree: DateTreeNode[] = sortedYears.map((yearStr) => {
    const monthsMap = yearsMap.get(yearStr)!;
    const sortedMonths = Array.from(monthsMap.keys()).sort((a, b) => a.localeCompare(b));

    const monthNodes: DateTreeNode[] = sortedMonths.map((monthStr) => {
      const monthIndex = parseInt(monthStr.split("-")[1], 10) - 1;
      const monthLabel = MONTH_NAMES[monthIndex] || monthStr;
      const daysSet = monthsMap.get(monthStr)!;
      const sortedDays = Array.from(daysSet).sort((a, b) => a.localeCompare(b));

      const dayNodes: DateTreeNode[] = sortedDays.map((dayStr) => {
        const dayNum = dayStr.split("-")[2];
        return {
          id: dayStr,
          label: dayNum,
          level: "day",
          dateStr: dayStr,
        };
      });

      return {
        id: monthStr,
        label: monthLabel,
        level: "month",
        children: dayNodes,
      };
    });

    return {
      id: yearStr,
      label: yearStr,
      level: "year",
      children: monthNodes,
    };
  });

  return tree;
}

export function getAllLeafDates(nodes: DateTreeNode[]): string[] {
  const dates: string[] = [];
  const traverse = (node: DateTreeNode) => {
    if (node.level === "day" && node.dateStr) {
      dates.push(node.dateStr);
    } else if (node.children) {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return dates;
}

export function getAllNodeIds(nodes: DateTreeNode[]): string[] {
  const ids: string[] = [];
  const traverse = (node: DateTreeNode) => {
    ids.push(node.id);
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return ids;
}

export default function DateFilterPopup<T>({
  columnLabel,
  data,
  columnKey,
  initialState,
  onApply,
  onClose,
}: DateFilterPopupProps<T>) {
  const tree = useMemo(() => buildDateTree(data, columnKey), [data, columnKey]);
  const allNodeIds = useMemo(() => getAllNodeIds(tree), [tree]);

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => {
    if (initialState?.selectedKeys && initialState.selectedKeys.length > 0) {
      return new Set(initialState.selectedKeys);
    }
    return new Set(allNodeIds);
  });

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
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

  const toggleExpand = (id: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getSubtreeNodeIds = (node: DateTreeNode): string[] => {
    const ids = [node.id];
    if (node.children) {
      node.children.forEach((child) => {
        ids.push(...getSubtreeNodeIds(child));
      });
    }
    return ids;
  };

  const getNodeState = (node: DateTreeNode): "checked" | "unchecked" | "indeterminate" => {
    const subtreeIds = getSubtreeNodeIds(node);
    const selectedCount = subtreeIds.filter((id) => selectedKeys.has(id)).length;

    if (selectedCount === 0) return "unchecked";
    if (selectedCount === subtreeIds.length) return "checked";
    return "indeterminate";
  };

  const handleToggleNode = (node: DateTreeNode) => {
    const currentState = getNodeState(node);
    const subtreeIds = getSubtreeNodeIds(node);

    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (currentState === "checked") {
        subtreeIds.forEach((id) => next.delete(id));
      } else {
        subtreeIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const isAllSelected = selectedKeys.size === allNodeIds.length && allNodeIds.length > 0;
  const isSomeSelected = selectedKeys.size > 0 && selectedKeys.size < allNodeIds.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(allNodeIds));
    }
  };

  const handleApply = () => {
    if (selectedKeys.size === 0 || selectedKeys.size === allNodeIds.length) {
      onApply(undefined);
    } else {
      const selectedLeafDates: string[] = [];
      const collectSelectedLeafs = (node: DateTreeNode) => {
        if (node.level === "day" && node.dateStr && selectedKeys.has(node.id)) {
          selectedLeafDates.push(node.dateStr);
        } else if (node.children) {
          node.children.forEach(collectSelectedLeafs);
        }
      };
      tree.forEach(collectSelectedLeafs);

      onApply({
        type: "date_tree",
        selectedKeys: Array.from(selectedKeys),
        selectedDates: selectedLeafDates,
      });
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const filterTree = (nodes: DateTreeNode[], query: string): DateTreeNode[] => {
    if (!query.trim()) return nodes;
    const lowerQuery = query.toLowerCase();

    return nodes
      .map((node): DateTreeNode | null => {
        const matchesSelf =
          node.label.toLowerCase().includes(lowerQuery) ||
          (node.dateStr && node.dateStr.toLowerCase().includes(lowerQuery));

        const filteredChildren = node.children ? filterTree(node.children, query) : undefined;
        const matchesChildren = filteredChildren && filteredChildren.length > 0;

        if (matchesSelf || matchesChildren) {
          return {
            ...node,
            children: filteredChildren ?? node.children,
          };
        }
        return null;
      })
      .filter((n): n is DateTreeNode => n !== null);
  };

  const filteredTree = useMemo(() => filterTree(tree, searchTerm), [tree, searchTerm]);

  const renderTreeNode = (node: DateTreeNode) => {
    const isExpanded = expandedKeys.has(node.id) || searchTerm.trim().length > 0;
    const hasChildren = node.children && node.children.length > 0;
    const state = getNodeState(node);

    return (
      <div key={node.id} className="date-tree-node">
        <div className="date-tree-row">
          {hasChildren ? (
            <button
              type="button"
              className="date-tree-expand-btn"
              onClick={() => toggleExpand(node.id)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="date-tree-expand-placeholder" />
          )}

          <button
            type="button"
            className={`date-tree-checkbox ${state}`}
            onClick={() => handleToggleNode(node)}
          >
            {state === "checked" && <Check size={12} />}
            {state === "indeterminate" && <Minus size={12} />}
          </button>

          <span
            className="date-tree-label"
            onClick={() => handleToggleNode(node)}
          >
            {node.label}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="date-tree-children">
            {node.children!.map((child) => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={popupRef} className="date-filter-popup">
      {/* Header with search */}
      <div className="date-filter-header">
        <div className="date-filter-search-box">
          <Search size={14} className="date-filter-search-icon" />
          <input
            type="text"
            className="date-filter-search-input"
            placeholder={`Search ${columnLabel}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="date-filter-clear-search"
              onClick={() => setSearchTerm("")}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Content Tree */}
      <div className="date-filter-content">
        {/* Select All Row */}
        <div className="date-tree-node select-all-node">
          <div className="date-tree-row">
            <span className="date-tree-expand-placeholder" />
            <button
              type="button"
              className={`date-tree-checkbox ${
                isAllSelected ? "checked" : isSomeSelected ? "indeterminate" : "unchecked"
              }`}
              onClick={handleToggleSelectAll}
            >
              {isAllSelected && <Check size={12} />}
              {isSomeSelected && <Minus size={12} />}
            </button>

            <span className="date-tree-label" onClick={handleToggleSelectAll}>
              Select All
            </span>
          </div>
        </div>

        <div className="date-tree-divider" />

        {/* Dynamic Tree Nodes */}
        {filteredTree.length > 0 ? (
          filteredTree.map((node) => renderTreeNode(node))
        ) : (
          <div className="date-tree-empty">No dates found</div>
        )}
      </div>

      {/* Footer OK and Cancel */}
      <div className="date-filter-footer">
        <button
          type="button"
          onClick={handleApply}
          className="date-filter-btn ok"
        >
          OK
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="date-filter-btn cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
