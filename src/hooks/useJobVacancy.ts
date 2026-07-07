import { useEffect, useState } from "react";
import { getJobVacancies } from "../services/jobVacancyService";
import type {
  JobVacancyItem,
  JobVacancyRequest,
} from "../types/jobVacancyTypes";

export function useJobVacancy(params: JobVacancyRequest) {
  const [data, setData] = useState<JobVacancyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const result = await getJobVacancies(params);

        if (mounted) {
          setData(result.data.content);
          setTotalItems(result.data.totalElements);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError("Failed to fetch job vacancies");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [params]);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getJobVacancies(params);
      setData(result.data.content);
      setTotalItems(result.data.totalElements);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch job vacancies");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    totalItems,
    refresh,
  };
}