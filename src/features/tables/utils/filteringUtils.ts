export function parseRowDate(
  val: unknown,
): { year: string; month: string; day: string; dateStr: string } | null {
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

export interface GenericTreeNode {
  id: string;
  label: string;
  value: string;
  level?: "root" | "year" | "month" | "day" | "item";
  children?: GenericTreeNode[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function buildGenericTree<T>(
  data: T[],
  columnKey: keyof T & string,
  filterType: "text" | "select" | "date" | "number" | "none" = "text",
  filterOptions?: Array<{ value: string; label: string }>,
): GenericTreeNode[] {
  if (!data || data.length === 0) {
    if (filterOptions && filterOptions.length > 0) {
      return filterOptions.map((opt) => ({
        id: opt.value,
        label: opt.label,
        value: opt.value,
        level: "item",
      }));
    }
    return [];
  }

  if (filterType === "date") {
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

    const sortedYears = Array.from(yearsMap.keys()).sort((a, b) =>
      b.localeCompare(a),
    );

    return sortedYears.map((yearStr) => {
      const monthsMap = yearsMap.get(yearStr)!;
      const sortedMonths = Array.from(monthsMap.keys()).sort((a, b) =>
        a.localeCompare(b),
      );

      const monthNodes: GenericTreeNode[] = sortedMonths.map((monthStr) => {
        const monthIndex = parseInt(monthStr.split("-")[1], 10) - 1;
        const monthLabel = MONTH_NAMES[monthIndex] || monthStr;
        const daysSet = monthsMap.get(monthStr)!;
        const sortedDays = Array.from(daysSet).sort((a, b) =>
          a.localeCompare(b),
        );

        const dayNodes: GenericTreeNode[] = sortedDays.map((dayStr) => {
          const dayNum = dayStr.split("-")[2];
          return {
            id: dayStr,
            label: dayNum,
            value: dayStr,
            level: "day",
          };
        });

        return {
          id: monthStr,
          label: monthLabel,
          value: monthStr,
          level: "month",
          children: dayNodes,
        };
      });

      return {
        id: yearStr,
        label: yearStr,
        value: yearStr,
        level: "year",
        children: monthNodes,
      };
    });
  }

  // Handle select / enum with predefined options
  if (filterType === "select" && filterOptions && filterOptions.length > 0) {
    return filterOptions.map((opt) => ({
      id: opt.value,
      label: opt.label,
      value: opt.value,
      level: "item",
    }));
  }

  // Extract unique values dynamically for text / select / number
  const uniqueValuesMap = new Map<string, string>(); // value -> label

  data.forEach((item) => {
    const rawVal = item[columnKey];
    if (rawVal === undefined || rawVal === null) {
      uniqueValuesMap.set("(Blank)", "(Blank)");
      return;
    }

    const strVal = String(rawVal).trim();
    if (strVal === "") {
      uniqueValuesMap.set("(Blank)", "(Blank)");
    } else {
      uniqueValuesMap.set(strVal, strVal);
    }
  });

  const sortedValues = Array.from(uniqueValuesMap.keys()).sort((a, b) => {
    if (a === "(Blank)") return 1;
    if (b === "(Blank)") return -1;
    if (filterType === "number") {
      const numA = Number(a);
      const numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    }
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });

  return sortedValues.map((val) => ({
    id: val,
    label: uniqueValuesMap.get(val) || val,
    value: val,
    level: "item",
  }));
}

export function getAllTreeLeafValues(nodes: GenericTreeNode[]): string[] {
  const values: string[] = [];
  const traverse = (node: GenericTreeNode) => {
    if (!node.children || node.children.length === 0) {
      values.push(node.value);
    } else {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return values;
}

export function getAllTreeNodeIds(nodes: GenericTreeNode[]): string[] {
  const ids: string[] = [];
  const traverse = (node: GenericTreeNode) => {
    ids.push(node.id);
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return ids;
}

export function filterGenericTree(
  nodes: GenericTreeNode[],
  query: string,
): GenericTreeNode[] {
  if (!query.trim()) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes
    .map((node): GenericTreeNode | null => {
      const matchesSelf =
        node.label.toLowerCase().includes(lowerQuery) ||
        node.value.toLowerCase().includes(lowerQuery);

      const filteredChildren = node.children
        ? filterGenericTree(node.children, query)
        : undefined;
      const matchesChildren = filteredChildren && filteredChildren.length > 0;

      if (matchesSelf || matchesChildren) {
        return {
          ...node,
          children: filteredChildren ?? node.children,
        };
      }
      return null;
    })
    .filter((n): n is GenericTreeNode => n !== null);
}
