import axios from "axios";
import { productStore } from "../stores/productStore";
import type { Product } from "../types/Product";

// URL base de la API
const API_URL = "http://localhost:8080/api/products";

// Configuración para manejar CORS
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

// Obtener todos los productos
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Actualizar estado a cargando
    productStore.set({
      ...productStore.get(),
      loading: true,
      error: null,
    });

    const response = await axios.get<Product[]>(API_URL);

    // Actualizar store con los productos
    productStore.set({
      products: response.data,
      loading: false,
      error: null,
    });

    return response.data;
  } catch (error) {
    // Manejar errores
    const errorMessage =
      error instanceof Error ? error.message : "Error al cargar productos";

    productStore.set({
      ...productStore.get(),
      loading: false,
      error: errorMessage,
    });

    throw error;
  }
};

// Obtener un producto por ID
export const getProductById = async (id: number | string): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Crear un nuevo producto
export const createProduct = async (productData: Product): Promise<Product> => {
  try {
    const response = await axios.post<Product>(API_URL, productData);

    // Actualizar el store con el nuevo producto
    const currentState = productStore.get();
    productStore.set({
      ...currentState,
      products: [...currentState.products, response.data],
    });

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProduct = async (
  id: number | string,
  productData: Product
): Promise<Product> => {
  try {
    const response = await axios.put<Product>(`${API_URL}/${id}`, productData);

    // Actualizar el producto en el store
    const currentState = productStore.get();
    const updatedProducts = currentState.products.map((product) =>
      product.id == id ? response.data : product
    );

    productStore.set({
      ...currentState,
      products: updatedProducts,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id: number | string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${id}`);

    // Eliminar el producto del store
    const currentState = productStore.get();
    const filteredProducts = currentState.products.filter(
      (product) => product.id != id
    );

    productStore.set({
      ...currentState,
      products: filteredProducts,
    });

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Buscar productos por nombre
export const searchProducts = async (name: string): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `${API_URL}/search?name=${name}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
