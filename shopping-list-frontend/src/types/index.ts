export interface ShoppingList {
    id: number;
    name: string;
    description: string;
    priority: number;
    created_at: string;
}

export interface Item {
    item_id: number;
    item_name: string;
    item_description: string;
    quantity: number;
    status: boolean;
    shopping_list_id: number;
}
