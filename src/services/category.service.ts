import { categoryStore } from "../stores/category.store";
import { getAuthHeaders, handleApiResponse } from "../utils/http.util";

// Interfaces
export interface Category {
    id?: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

const API_URL = "http://localhost:8080/api/categories";

// Obtener todas las categorías
export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch(API_URL, {
            headers: getAuthHeaders()
        });

        const categories = await handleApiResponse<Category[]>(response);
        categoryStore.set({ categories });
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Buscar categorías por nombre
export const searchCategories = async (searchTerm: string): Promise<Category[]> => {
    try {
        const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(searchTerm)}`, {
            headers: getAuthHeaders()
        });

        const categories = await handleApiResponse<Category[]>(response);
        categoryStore.set({ categories });
        return categories;
    } catch (error) {
        console.error("Error searching categories:", error);
        throw error;
    }
};

// Obtener una categoría por ID
export const fetchCategoryById = async (id: number): Promise<Category> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: getAuthHeaders()
        });

        return await handleApiResponse<Category>(response);
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};

// Crear una nueva categoría (sólo admin)
export const createCategory = async (categoryData: Category): Promise<Category> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData),
        });

        const newCategory = await handleApiResponse<Category>(response);

        // Actualizar el store
        const { categories } = categoryStore.get();
        categoryStore.set({ categories: [...categories, newCategory] });

        return newCategory;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

// Actualizar una categoría existente (sólo admin)
export const updateCategory = async (id: number, categoryData: Category): Promise<Category> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData),
        });

        const updatedCategory = await handleApiResponse<Category>(response);

        // Actualizar el store
        const { categories } = categoryStore.get();
        const updatedCategories = categories.map((category) =>
            category.id === id ? updatedCategory : category
        );
        categoryStore.set({ categories: updatedCategories });

        return updatedCategory;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

// Eliminar una categoría (sólo admin)
export const deleteCategory = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        await handleApiResponse<void>(response);

        // Actualizar el store
        const { categories } = categoryStore.get();
        const updatedCategories = categories.filter((category) => category.id !== id);
        categoryStore.set({ categories: updatedCategories });

        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};