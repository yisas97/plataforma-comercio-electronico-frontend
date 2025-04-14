import {persistentAtom} from "@nanostores/persistent";
import type {Product} from "../types/Product";
import {type Category, fetchCategories} from "../services/category.service";
import type {Tag} from "../services/tag.service";
import {fetchProducts} from "../services/productService";

interface ProductState {
    products: Product[];
    categories: Category[];
    tags: Tag[];
    loading: boolean;
    error: string | null;
}

// Estado global para los productos
export const productStore = persistentAtom<ProductState>(
    "products",
    {
        products: [],
        categories: [],
        tags: [],
        loading: false,
        error: null,
    },
    {
        encode: JSON.stringify,
        decode: JSON.parse,
    }
);

async function loadData() {
    productStore.set({
        products: [],
        categories: [],
        tags: [],
        loading: true,
        error: null
    });

    try {
        const [products, categories] = await Promise.all([
            fetchProducts(),
            fetchCategories()
        ]);

        productStore.set({
            products,
            categories,
            tags: [], // si tienes lógica para tags, también aquí
            loading: false,
            error: null
        });
    } catch (err) {
        productStore.set({
            products: [],
            categories: [],
            tags: [],
            loading: false,
            error: "Error al cargar productos o categorías"
        });
    }
}

loadData();