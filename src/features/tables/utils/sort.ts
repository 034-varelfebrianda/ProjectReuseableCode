import { SortDirectionEnum } from "../../../types/enums";

export { SortDirectionEnum };
export type SortDirection = SortDirectionEnum | "asc" | "desc";
export type SortMode = "client" | "server";

export type SortValueResolver<T> = (
  item: T,
  field: keyof T & string,
) => string | number | boolean | Date | null | undefined;

interface ComparableValue {
  type: "number" | "string";
  value: number | string;
}

function toComparableValue(value: unknown): ComparableValue {
  if (value instanceof Date) {
    return { type: "number", value: value.getTime() };
  }

  if (typeof value === "number") {
    return { type: "number", value };
  }

  if (typeof value === "boolean") {
    return { type: "number", value: value ? 1 : 0 };
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    const parsedDate = Date.parse(trimmedValue);

    if (!Number.isNaN(parsedDate)) {
      return { type: "number", value: parsedDate };
    }

    return { type: "string", value: trimmedValue.toLowerCase() };
  }

  if (value === null || value === undefined) {
    return { type: "string", value: "" };
  }

  return { type: "string", value: String(value).toLowerCase() };
}

export function sortItems<T extends object>(
  items: T[],
  field: (keyof T & string) | null,
  direction: SortDirection = "asc",
  valueResolver?: SortValueResolver<T>,
): T[] {
  if (!field) {
    return [...items];
  }

  return [...items].sort((a, b) => {
    const aValue = valueResolver ? valueResolver(a, field) : a[field];
    const bValue = valueResolver ? valueResolver(b, field) : b[field];

    const aComparable = toComparableValue(aValue);
    const bComparable = toComparableValue(bValue);

    if (aComparable.type === "number" && bComparable.type === "number") {
      const aNumber = aComparable.value as number;
      const bNumber = bComparable.value as number;
      if (aNumber < bNumber) {
        return direction === "asc" ? -1 : 1;
      }
      if (aNumber > bNumber) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    }

    const aString = String(aComparable.value);
    const bString = String(bComparable.value);
    if (aString < bString) {
      return direction === "asc" ? -1 : 1;
    }
    if (aString > bString) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });
}
