import { Router } from 'express';
import pool from './db';
import axios from 'axios';

const router = Router();
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

// Retrieve shopping lists
router.get('/shopping-lists', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shopping_lists ORDER BY priority ASC, id ASC');
        res.json(result.rows);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unbekannter Fehler' });
        }
    }
});

// Retrieve all items in a shopping list
router.get('/shopping-lists/:id/items', async (req, res) => {
    try {
        const { id } = req.params; // ID der Einkaufsliste

        const result = await pool.query(
            `SELECT 
                i.id AS item_id,
                i.name AS item_name,
                i.description AS item_description,
                sli.quantity,
                sli.status
             FROM 
                items i
             JOIN 
                shopping_list_items sli ON i.id = sli.item_id
             WHERE 
                sli.shopping_list_id = $1`,
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    }
});

// Add shopping list
router.post('/shopping-lists', async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await pool.query(
            'INSERT INTO shopping_lists (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.json(result.rows[0]);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unbekannter Fehler' });
        }
    }
});

// Edit shopping list
router.put('/shopping-lists/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const result = await pool.query(
            'UPDATE shopping_lists SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unbekannter Fehler' });
        }
    }
});

// Edit article
router.put('/shopping-lists/:listId/items/:itemId', async (req, res) => {
    try {
        const { listId, itemId } = req.params;
        const { name, description, quantity, status } = req.body;

        // Check whether the article exists
        const itemExists = await pool.query(
            'SELECT * FROM shopping_list_items WHERE shopping_list_id = $1 AND item_id = $2',
            [listId, itemId]
        );

        if (itemExists.rowCount === 0) {
            res.status(404).json({ message: 'Artikel in der Einkaufsliste nicht gefunden' });
        }

        // Update article information
        await pool.query(
            'UPDATE items SET name = $1, description = $2 WHERE id = $3',
            [name, description, itemId]
        );

        await pool.query(
            'UPDATE shopping_list_items SET quantity = $1, status = $2 WHERE shopping_list_id = $3 AND item_id = $4',
            [quantity, status, listId, itemId]
        );

        res.json({ message: 'Artikel erfolgreich aktualisiert' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    }
});


// Delete shopping list
router.delete('/shopping-lists/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM shopping_lists WHERE id = $1', [id]);
        res.json({ message: 'Einkaufsliste gelöscht' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unbekannter Fehler' });
        }
    }
});

// Add an item to a shopping list
router.post('/shopping-lists/:id/items', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, quantity, status } = req.body;

        const itemResult = await pool.query(
            'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING id',
            [name, description]
        );
        const itemId = itemResult.rows[0].id;

        await pool.query(
            'INSERT INTO shopping_list_items (shopping_list_id, item_id, quantity, status) VALUES ($1, $2, $3, $4)',
            [id, itemId, quantity, status]
        );

        res.status(201).json({ itemId, message: 'Artikel erfolgreich hinzugefügt' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    }
});

// Remove an item from a shopping list
router.delete('/shopping-lists/:id/items/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;

        await pool.query(
            'DELETE FROM shopping_list_items WHERE shopping_list_id = $1 AND item_id = $2',
            [id, itemId]
        );

        await pool.query('DELETE FROM items WHERE id = $1', [itemId]);

        res.json({ message: 'Artikel erfolgreich entfernt' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    }
});

// Retrieve shopping lists that contain a specific item
router.get('/shopping-lists/items/:itemName', async (req, res) => {
    try {
        const { itemName } = req.params;

        const result = await pool.query(
            `SELECT DISTINCT sl.*
             FROM shopping_lists sl
             JOIN shopping_list_items sli ON sl.id = sli.shopping_list_id
             JOIN items i ON sli.item_id = i.id
             WHERE i.name ILIKE $1`,
            [`%${itemName}%`]
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    }
});

// Search shopping lists by name or description
router.get('/shopping-lists/search', async (req, res) => {
    try {
        const { query } = req.query;

        const result = await pool.query(
            `SELECT * FROM shopping_lists
             WHERE name ILIKE $1 OR description ILIKE $2`,
            [`%${query}%`, `%${query}%`]
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    }
});

// Update list priority
router.put('/shopping-lists/:id/priority', async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        if (![1, 2, 3].includes(priority)) {
            res.status(400).json({ message: 'Ungültige Priorität. Werte: 1 (Hoch), 2 (Mittel), 3 (Niedrig).' });
        }

        const result = await pool.query(
            'UPDATE shopping_lists SET priority = $1 WHERE id = $2 RETURNING *',
            [priority, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unbekannter Fehler' });
    }
});

// search for a recept
router.get('/recipes/search', async (req, res) => {
    try {
        const { query } = req.query;

        const response = await axios.get<{
            results: { id: number; title: string; image: string }[];
        }>('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query,
                number: 10,
            },
        });

        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({
            message: 'Fehler beim Abrufen der Rezepte',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        });
    }
});

// Call up the ingredients of a recipe
router.get('/recipes/:id/ingredients', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get<{
            ingredients: {
                name: string;
                amount: { metric: { value: number; unit: string } };
            }[];
        }>(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
            },
        });

        res.json(response.data.ingredients);
    } catch (error) {
        res.status(500).json({
            message: 'Fehler beim Abrufen der Zutaten',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        });
    }
});

// Add ingredients of a recipe to a new shopping list
router.post('/recipes/:id/add-to-shopping-list', async (req, res) => {
    try {
        const { id } = req.params;
        const { listName, description } = req.body;

        // 1. Zutaten des Rezepts abrufen
        const response = await axios.get<{
            ingredients: {
                name: string;
                amount: { metric: { value: number; unit: string } };
            }[];
        }>(`https://api.spoonacular.com/recipes/${id}/ingredientWidget.json`, {
            params: { apiKey: SPOONACULAR_API_KEY },
        });

        const ingredients = response.data.ingredients;

        // 2. Neue Einkaufsliste erstellen
        const shoppingListResult = await pool.query(
            'INSERT INTO shopping_lists (name, description) VALUES ($1, $2) RETURNING id',
            [listName, description]
        );

        const shoppingListId = shoppingListResult.rows[0].id;

        // 3. Zutaten zur Einkaufsliste hinzufügen
        for (const ingredient of ingredients) {
            const quantity = ingredient.amount.metric.value;
            const unit = ingredient.amount.metric.unit;
            const name = ingredient.name;

            console.log(`Parsed Ingredient: ${quantity} ${unit} ${name}`); // Debugging

            // Füge den Artikel in die Datenbank ein
            const itemResult = await pool.query(
                'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING id',
                [name, `${quantity} ${unit}`]
            );

            const itemId = itemResult.rows[0].id;

            // Verknüpfe den Artikel mit der Einkaufsliste
            await pool.query(
                'INSERT INTO shopping_list_items (shopping_list_id, item_id, quantity, status) VALUES ($1, $2, $3, $4)',
                [shoppingListId, itemId, quantity, false]
            );
        }

        res.status(201).json({
            message: 'Neue Einkaufsliste erstellt und Zutaten hinzugefügt.',
            shoppingListId,
        });
    } catch (error) {
        console.error('Fehler:', error); // Debugging
        res.status(500).json({
            message: 'Fehler beim Hinzufügen der Zutaten zur Einkaufsliste.',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        });
    }
});

export default router;
