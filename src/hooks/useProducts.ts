import { useEffect, useState } from "react";
import { getProducts, type ProductItem } from "../services/ProductsService";

export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return {
    products,
    loading,
  };
}