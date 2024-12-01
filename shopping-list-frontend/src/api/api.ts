import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend-URL

// Retrieve shopping lists
export const fetchShoppingLists = async () => {
    const response = await axios.get(`${API_URL}/shopping-lists`);
    return response.data;
};

// Retrieve items from a shopping list
export const fetchShoppingListItems = async (listId: number) => {
    const response = await axios.get(`${API_URL}/shopping-lists/${listId}/items`);
    return response.data;
};

// Create a new shopping list
export const createShoppingList = async (name: string, description: string) => {
    const response = await axios.post(`${API_URL}/shopping-lists`, { name, description });
    return response.data;
};

// Delete a shopping-list
export const deleteShoppingList = async (id: number) => {
    const response = await axios.delete(`${API_URL}/shopping-lists/${id}`);
    return response.data;
};

// Delete an article from a shopping-list
export const deleteArticle = async (listId: number, itemId: number) => {
    const response = await axios.delete(`${API_URL}/shopping-lists/${listId}/items/${itemId}`);
    return response.data;
};

// Add an item to a shopping list
export const addItemToList = async (listId: number, itemData: { name: string; description: string; quantity: number; status: boolean }) => {
    const response = await axios.post(`${API_URL}/shopping-lists/${listId}/items`, itemData);
    return response.data;
};

// Update shopping list
export const updateShoppingList = async (listId: number, updatedData: { name: string; description: string }) => {
    const response = await axios.put(`${API_URL}/shopping-lists/${listId}`, updatedData);
    return response.data;
};

// Update an article
export const updateArticle = async (
    listId: number,
    itemId: number,
    updatedData: { name: string; description: string; quantity: number; status: boolean }
) => {
    const response = await axios.put(
        `${API_URL}/shopping-lists/${listId}/items/${itemId}`,
        updatedData
    );
    return response.data;
};

// Search shopping lists by name or description
export const searchShoppingLists = async (query: string) => {
    const response = await axios.get(`${API_URL}/shopping-lists/search`, {
        params: { query },
    });
    return response.data;
};

// Retrieve shopping lists that contain a specific item
export const getListsByItem = async (itemName: string) => {
    const response = await axios.get(`${API_URL}/shopping-lists/items/${itemName}`);
    return response.data;
};

// Update list priority
export const updateListPriority = async (id: number, priority: number) => {
    const response = await axios.put(`${API_URL}/shopping-lists/${id}/priority`, { priority });
    return response.data;
};

// Rezepte suchen
export const searchRecipes = async (query: string) => {
    const response = await axios.get<{ id: number; title: string; image: string }[]>(
        'http://localhost:5000/api/recipes/search',
        { params: { query } }
    );
    return response.data;
};

// Zutaten eines Rezepts abrufen
export const getRecipeIngredients = async (id: number) => {
    const response = await axios.get<{
        name: string;
        amount: { metric: { value: number; unit: string } };
    }[]>(`http://localhost:5000/api/recipes/${id}/ingredients`);
    return response.data;
};


