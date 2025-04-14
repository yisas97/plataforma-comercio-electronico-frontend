import { productStore } from "../stores/productStore";
import {handleApiResponse} from "../utils/http.util";
import {fetchCategories} from "./category.service";

// Interfaces
export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  sku?: string;
  producer?: any;
  categoryIds?: number[];
  tagIds?: number[];
}

export interface ProductCategory {
  id?: number;
  category: Category;
  createdAt?: string;
}

export interface ProductTag {
  id?: number;
  tag: Tag;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "http://localhost:8080/api/products";

// Función auxiliar para obtener el token de autenticación
function getAuthToken(): string | null {
  // Obtener el token del localStorage
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}

// Función para crear los headers con el token de autenticación
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ''
  };
}

// Obtener productos del productor actual
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const products: Product[] = await response.json();
    productStore.set({ products });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Crear un nuevo producto (para el productor autenticado)
export const createProduct = async (productData: Product): Promise<Product> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const newProduct: Product = await response.json();

    // Actualizar el store
    const { products } = productStore.get();
    productStore.set({ products: [...products, newProduct] });

    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Actualizar un producto existente (verificando que pertenezca al productor autenticado)
export const updateProduct = async (id: number, productData: Product): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const updatedProduct: Product = await response.json();

    // Actualizar el store
    const { products } = productStore.get();
    const updatedProducts = products.map((product) =>
        product.id === id ? updatedProduct : product
    );
    productStore.set({ products: updatedProducts });

    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Eliminar un producto (verificando que pertenezca al productor autenticado)
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Actualizar el store
    const { products } = productStore.get();
    const updatedProducts = products.filter((product) => product.id !== id);
    productStore.set({ products: updatedProducts });

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Buscar productos por nombre (solo para el productor autenticado)
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(searchTerm)}`, {
      headers: getAuthHeaders()
    });

    const products = await handleApiResponse<Product[]>(response);
    productStore.set({ products });
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Nuevas funciones para gestionar las relaciones de categorías y etiquetas

// Obtener productos por categoría
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/by-category/${categoryId}`, {
      headers: getAuthHeaders()
    });

    const products = await handleApiResponse<Product[]>(response);
    productStore.set({ products });
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

// Obtener productos por etiqueta
export const fetchProductsByTag = async (tagId: number): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/by-tag/${tagId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const products: Product[] = await response.json();
    productStore.set({ products });
    return products;
  } catch (error) {
    console.error("Error fetching products by tag:", error);
    throw error;
  }
};

// Filtrar productos por múltiples categorías y etiquetas
export const filterProducts = async (categoryIds: number[] = [], tagIds: number[] = []): Promise<Product[]> => {
  try {
    let url = `${API_URL}/filter`;
    const params: string[] = [];

    if (categoryIds.length > 0) {
      categoryIds.forEach(id => params.push(`categoryIds=${id}`));
    }

    if (tagIds.length > 0) {
      tagIds.forEach(id => params.push(`tagIds=${id}`));
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const products: Product[] = await response.json();
    productStore.set({ products });
    return products;
  } catch (error) {
    console.error("Error filtering products:", error);
    throw error;
  }
};

// Añadir una categoría a un producto
export const addCategoryToProduct = async (productId: number, categoryId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${productId}/categories/${categoryId}`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error adding category to product:", error);
    throw error;
  }
};

// Eliminar una categoría de un producto
export const removeCategoryFromProduct = async (productId: number, categoryId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${productId}/categories/${categoryId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error removing category from product:", error);
    throw error;
  }
};

// Añadir una etiqueta a un producto
export const addTagToProduct = async (productId: number, tagId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${productId}/tags/${tagId}`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error adding tag to product:", error);
    throw error;
  }
};

// Eliminar una etiqueta de un producto
export const removeTagFromProduct = async (productId: number, tagId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${productId}/tags/${tagId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error removing tag from product:", error);
    throw error;
  }
};

async function loadProductData() {
  try {
    // Cargar productos y categorías
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);

    productStore.set({
      products,
      categories,
      loading: false,
      error: null
    });
  } catch (error) {
    productStore.set({
      products: [],
      categories: [],
      loading: false,
      error: error.message
    });
  }
}