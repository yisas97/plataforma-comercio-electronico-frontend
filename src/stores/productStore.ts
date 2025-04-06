import { persistentAtom } from "@nanostores/persistent";
import type { Product } from "../types/Product";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Estado global para los productos
export const productStore = persistentAtom<ProductState>(
  "products",
  {
    products: [],
    loading: false,
    error: null,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
