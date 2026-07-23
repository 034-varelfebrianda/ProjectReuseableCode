import type { DateTreeNode } from "../components/atoms/DateFilterPopup";

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

export function buildDateTree<T>(
  data: T[],
  columnKey: keyof T & string,
): DateTreeNode[] {
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

  const tree: DateTreeNode[] = sortedYears.map((yearStr) => {
    const monthsMap = yearsMap.get(yearStr)!;
    const sortedMonths = Array.from(monthsMap.keys()).sort((a, b) =>
      a.localeCompare(b),
    );

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

export function filterTree(
  nodes: DateTreeNode[],
  query: string,
): DateTreeNode[] {
  if (!query.trim()) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes
    .map((node): DateTreeNode | null => {
      const matchesSelf =
        node.label.toLowerCase().includes(lowerQuery) ||
        (node.dateStr && node.dateStr.toLowerCase().includes(lowerQuery));

      const filteredChildren = node.children
        ? filterTree(node.children, query)
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
    .filter((n): n is DateTreeNode => n !== null);
}
