import type { ApiResponse } from "../types/JobvacationTypes";

const JOB_URL = import.meta.env.VITE_JOBVACATION_API

export async function getJobVacancies(
  page = 0,
  size = 10,
  sortBy?: string,
  order?: "asc" | "desc",
  filters: Record<string, unknown> = {}
): Promise<ApiResponse> {
  const endpoint = JOB_URL.includes("/job-vacancies/users/filtered")
    ? JOB_URL
    : `${JOB_URL}/job-vacancies/users/filtered`;

  const body = {
    page,
    size,
    filters,
    ...(sortBy ? { sortBy } : {}),
    ...(order ? { order } : {}),
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse = await response.json();

  return data;
}