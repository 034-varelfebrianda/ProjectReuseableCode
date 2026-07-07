import { useEffect, useState } from "react";
import { getJobVacancies } from "../services/JobvacationService";
import type { JobVacancy } from "../types/JobvacationTypes";

export function useJobVacancies() {
  const [data, setData] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchJobvacation = async (
    page = 0,
    size = 10,
    sortBy?: string,
    order?: "asc" | "desc",
    filters: Record<string, string> = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getJobVacancies(page, size, sortBy, order, filters);

      setData(result.data.content);
      setTotalItems(result.data.totalElements);
      setTotalPages(result.data.totalPages);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadJobVacancies() {
      await fetchJobvacation(0, 10, "applicationDeadline", "asc", {});
    }

    void loadJobVacancies();
  }, []);

  return {
    data,
    loading,
    error,
    totalItems,
    totalPages,
    fetchJobvacation,
  };
}