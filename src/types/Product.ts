export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  category?: string;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
  categoryIds: number[];
  tagIds: number[];
  productCategories?: Array<{
    category: {
      id: number;
      name: string;
    }
  }>;
  productTags?: Array<{
    tag: {
      id: number;
      name: string;
    }
  }>;
}