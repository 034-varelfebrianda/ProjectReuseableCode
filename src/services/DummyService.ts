import { ProductItem, DummyProduct, DummyApiResponse } from "../types/DummyTypes";

const BASE_URL = import.meta.env.VITE_DUMMY_API || "https://dummyjson.com/products";

export async function getProducts(
  sortBy?: string,
  order: "asc" | "desc" = "asc"
): Promise<ProductItem[]> {
  let url = BASE_URL;
  
  // Add sorting parameters if provided
  if (sortBy) {
    const params = new URLSearchParams();
    params.append("sortBy", sortBy);
    params.append("order", order);
    url = `${BASE_URL}?${params.toString()}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: DummyApiResponse = await response.json();
  const products = Array.isArray(data) ? data : data.products;

  return products.map((product: DummyProduct) => ({
    id: product.id,
    name: product.title,
    url: `https://dummyjson.com/products/${product.id}`,
    ability: product.category,
    price: product.price,
    image: product.thumbnail ?? product.images?.[0] ?? product.image ?? "",
  }));
}