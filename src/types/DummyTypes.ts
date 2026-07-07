export interface ProductItem {
  id: number;
  name: string;
  url: string;
  ability: string;
  price: number;
  image: string;
}

export interface DummyProduct {
  id: number;
  title: string;
  category: string;
  thumbnail?: string;
  images?: string[];
  image?: string;
  description: string;
  price: number;
}

export interface DummyApiResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}
