import { tagStore } from "../stores/tag.store";
import { getAuthHeaders, handleApiResponse } from "../utils/http.util";

// Interfaces
export interface Tag {
    id?: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

const API_URL = "http://localhost:8080/api/tags";

// Obtener todas las etiquetas
export const fetchTags = async (): Promise<Tag[]> => {
    try {
        const response = await fetch(API_URL, {
            headers: getAuthHeaders()
        });

        const tags = await handleApiResponse<Tag[]>(response);
        tagStore.set({ tags });
        return tags;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
};

// Buscar etiquetas por nombre
export const searchTags = async (searchTerm: string): Promise<Tag[]> => {
    try {
        const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(searchTerm)}`, {
            headers: getAuthHeaders()
        });

        const tags = await handleApiResponse<Tag[]>(response);
        tagStore.set({ tags });
        return tags;
    } catch (error) {
        console.error("Error searching tags:", error);
        throw error;
    }
};

// Obtener una etiqueta por ID
export const fetchTagById = async (id: number): Promise<Tag> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: getAuthHeaders()
        });

        return await handleApiResponse<Tag>(response);
    } catch (error) {
        console.error("Error fetching tag:", error);
        throw error;
    }
};

// Crear una nueva etiqueta (sólo admin)
export const createTag = async (tagData: Tag): Promise<Tag> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(tagData),
        });

        const newTag = await handleApiResponse<Tag>(response);

        // Actualizar el store
        const { tags } = tagStore.get();
        tagStore.set({ tags: [...tags, newTag] });

        return newTag;
    } catch (error) {
        console.error("Error creating tag:", error);
        throw error;
    }
};

// Actualizar una etiqueta existente (sólo admin)
export const updateTag = async (id: number, tagData: Tag): Promise<Tag> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(tagData),
        });

        const updatedTag = await handleApiResponse<Tag>(response);

        // Actualizar el store
        const { tags } = tagStore.get();
        const updatedTags = tags.map((tag) =>
            tag.id === id ? updatedTag : tag
        );
        tagStore.set({ tags: updatedTags });

        return updatedTag;
    } catch (error) {
        console.error("Error updating tag:", error);
        throw error;
    }
};

// Eliminar una etiqueta (sólo admin)
export const deleteTag = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        await handleApiResponse<void>(response);

        // Actualizar el store
        const { tags } = tagStore.get();
        const updatedTags = tags.filter((tag) => tag.id !== id);
        tagStore.set({ tags: updatedTags });

        return true;
    } catch (error) {
        console.error("Error deleting tag:", error);
        throw error;
    }
};