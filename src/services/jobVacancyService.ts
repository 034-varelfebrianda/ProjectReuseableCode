import type {
  JobVacancyRequest,
  JobVacancyResponse,
} from "../types/jobVacancyTypes";

const JOBVACATION_API = import.meta.env.VITE_JOBVACATION_API || import.meta.env.VITE_BASE_URL;

if (!JOBVACATION_API) {
  throw new Error("Missing VITE_JOBVACATION_API or VITE_BASE_URL environment variable");
}

export async function getJobVacancies(
  body: JobVacancyRequest
): Promise<JobVacancyResponse> {
  const response = await fetch(
    `${JOBVACATION_API}/job-vacancies/users/filtered`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const result: JobVacancyResponse = await response.json();

  return result;
}