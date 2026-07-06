const BASE_URL = import.meta.env.VITE_FAKESTORE_API || import.meta.env.VITE_BASE_URL || "https://fakestoreapi.com/products";

export interface ProductItem {
  id: number;
  name: string;
  url: string;
  ability: string;
  image: string;
}

interface FakeStoreProduct {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

export async function getProducts(): Promise<ProductItem[]> {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: FakeStoreProduct[] = await response.json();

  return data.map((product) => ({
    id: product.id,
    name: product.title,
    url: `https://fakestoreapi.com/products/${product.id}`,
    ability: product.category,
    image: product.image,
  }));
}