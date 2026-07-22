/**
 * Implementation of Enumerations (Enums) in TypeScript.
 * Compatible with modern TypeScript compiler settings (`erasableSyntaxOnly` / Node.js type stripping).
 */

// Filter Operation Enum
export const FilterOperation = {
  MATCH: "MATCH",
  EQUAL: "EQUAL",
} as const;
export type FilterOperation = (typeof FilterOperation)[keyof typeof FilterOperation];

// Filter Conjunction Enum
export const FilterConjunction = {
  AND: "and",
  OR: "or",
} as const;
export type FilterConjunction = (typeof FilterConjunction)[keyof typeof FilterConjunction];

// Sort Direction Enum
export const SortDirectionEnum = {
  ASC: "asc",
  DESC: "desc",
} as const;
export type SortDirectionEnum = (typeof SortDirectionEnum)[keyof typeof SortDirectionEnum];

// Filter Comparison Operator Enum
export const FilterOperator = {
  CONTAINS: "contains",
  EQUALS: "equals",
  STARTS_WITH: "startsWith",
  ENDS_WITH: "endsWith",
} as const;
export type FilterOperator = (typeof FilterOperator)[keyof typeof FilterOperator];

// Filter Logic Enum (AND / OR)
export const FilterLogic = {
  AND: "AND",
  OR: "OR",
} as const;
export type FilterLogic = (typeof FilterLogic)[keyof typeof FilterLogic];

// Job Status Enum
export const JobStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  CLOSED: "CLOSED",
  DRAFT: "DRAFT",
} as const;
export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

// Job Type Enum
export const JobType = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
} as const;
export type JobType = (typeof JobType)[keyof typeof JobType];
