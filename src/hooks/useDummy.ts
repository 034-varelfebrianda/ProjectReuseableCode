import { useEffect, useState } from "react";
import { getProducts, type ProductItem } from "../services/DummyService";

interface UseDummyOptions {
  sortBy?: string;
  order?: "asc" | "desc";
}

interface UseDummyState {
  products: ProductItem[];
  loading: boolean;
  error: string | null;
}

export function useDummy(options?: UseDummyOptions) {
  const [state, setState] = useState<UseDummyState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    getProducts(options?.sortBy, options?.order)
      .then((products) =>
        setState({
          products,
          loading: false,
          error: null,
        })
      )
      .catch((err) => {
        if (err.name !== "AbortError") {
          setState({
            products: [],
            loading: false,
            error: err.message,
          });
        }
      });

    return () => controller.abort();
  }, [options?.sortBy, options?.order]);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
  };
}
