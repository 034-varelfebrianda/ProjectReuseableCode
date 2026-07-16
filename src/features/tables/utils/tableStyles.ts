import type { Column } from "./types";

export function getAlignClass(align?: Column<never>["align"]) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "";
}
