import request from 'supertest';
import app from '../src/index';
import pool from '../src/db';
import { Server } from 'http';

let server: Server; // Store the server instance

// Create tables (if not available)
beforeAll(async () => {
    try {

        server = app.listen(5000);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS shopping_lists (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS shopping_list_items (
                shopping_list_id INT REFERENCES shopping_lists(id) ON DELETE CASCADE,
                item_id INT REFERENCES items(id) ON DELETE CASCADE,
                quantity INT,
                status BOOLEAN DEFAULT FALSE,
                PRIMARY KEY (shopping_list_id, item_id)
            );
        `);
    } catch (error) {
        console.error('Fehler beim Erstellen der Tabellen:', error);
        throw error;
    }
});

// Clean up the database after each test
afterEach(async () => {
    try {
        await pool.query('TRUNCATE shopping_list_items, items, shopping_lists RESTART IDENTITY CASCADE');
    } catch (error) {
        console.error('Fehler beim Bereinigen der Tabellen:', error);
        throw error;
    }
});

// Close database connection after all tests
afterAll(async () => {
    try {
        server.close();
        await pool.end();
    } catch (error) {
        console.error('Fehler beim Schließen der Datenbankverbindung:', error);
    }
});

// Test: Create a shopping list
test('POST /api/shopping-lists sollte eine Einkaufsliste erstellen', async () => {
    const res = await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test List');
});

// Test: Retrieve all shopping lists
test('GET /api/shopping-lists sollte alle Einkaufslisten zurückgeben', async () => {
    await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });

    const res = await request(app).get('/api/shopping-lists');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name', 'Test List');
});

// Test: Update a shopping list
test('PUT /api/shopping-lists/:id sollte eine Einkaufsliste aktualisieren', async () => {
    const list = await request(app).post('/api/shopping-lists').send({
        name: 'Old Name',
        description: 'Old description',
    });

    const res = await request(app).put(`/api/shopping-lists/${list.body.id}`).send({
        name: 'Updated Name',
        description: 'Updated description',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Name');
    expect(res.body.description).toBe('Updated description');
});

// Test: Delete a shopping list
test('DELETE /api/shopping-lists/:id sollte eine Einkaufsliste löschen', async () => {
    const list = await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });

    const res = await request(app).delete(`/api/shopping-lists/${list.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Einkaufsliste gelöscht');

    const lists = await request(app).get('/api/shopping-lists');
    expect(lists.body.length).toBe(0);
});

// Test: Add an item to a shopping list
test('POST /api/shopping-lists/:id/items sollte einen Artikel hinzufügen', async () => {
    const list = await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });

    const res = await request(app).post(`/api/shopping-lists/${list.body.id}/items`).send({
        name: 'Test Item',
        description: 'This is a test item',
        quantity: 2,
        status: false,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Artikel erfolgreich hinzugefügt');
});

// Test: Retrieve all items in a shopping list
test('GET /api/shopping-lists/:id/items sollte alle Artikel zurückgeben', async () => {
    const list = await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });

    await request(app).post(`/api/shopping-lists/${list.body.id}/items`).send({
        name: 'Test Item',
        description: 'This is a test item',
        quantity: 2,
        status: false,
    });

    const res = await request(app).get(`/api/shopping-lists/${list.body.id}/items`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('item_name', 'Test Item');
});

// Test: Delete an item from a shopping list
test('DELETE /api/shopping-lists/:id/items/:itemId sollte einen Artikel löschen', async () => {
    const list = await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });
    
    const item = await request(app).post(`/api/shopping-lists/${list.body.id}/items`).send({
        name: 'Test Item',
        description: 'This is a test item',
        quantity: 2,
        status: false,
    });

    const res = await request(app).delete(`/api/shopping-lists/${list.body.id}/items/${item.body.itemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Artikel erfolgreich entfernt');
});

//Test: Edit an article in a shopping list
test('PUT /api/shopping-lists/:listId/items/:itemId sollte einen Artikel aktualisieren', async () => {
    const list = await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });

    const item = await request(app).post(`/api/shopping-lists/${list.body.id}/items`).send({
        name: 'Test Item',
        description: 'This is a test item',
        quantity: 2,
        status: false,
    });

    const res = await request(app)
        .put(`/api/shopping-lists/${list.body.id}/items/${item.body.itemId}`)
        .send({
            name: 'Updated Item',
            description: 'Updated description',
            quantity: 5,
            status: true,
        });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Artikel erfolgreich aktualisiert');

    const updatedItems = await request(app).get(`/api/shopping-lists/${list.body.id}/items`);
    expect(updatedItems.body[0]).toHaveProperty('item_name', 'Updated Item');
    expect(updatedItems.body[0]).toHaveProperty('item_description', 'Updated description');
    expect(updatedItems.body[0]).toHaveProperty('quantity', 5);
    expect(updatedItems.body[0]).toHaveProperty('status', true);
});

//Test: Retrieve shopping lists that contain a specific item
test('GET /api/shopping-lists/items/:itemName sollte Einkaufslisten mit einem bestimmten Artikel zurückgeben', async () => {
    const list1 = await request(app).post('/api/shopping-lists').send({
        name: 'List 1',
        description: 'First shopping list',
    });

    const list2 = await request(app).post('/api/shopping-lists').send({
        name: 'List 2',
        description: 'Second shopping list',
    });

    await request(app).post(`/api/shopping-lists/${list1.body.id}/items`).send({
        name: 'Milk',
        description: 'Dairy product',
        quantity: 1,
        status: false,
    });

    await request(app).post(`/api/shopping-lists/${list2.body.id}/items`).send({
        name: 'Milk',
        description: 'Dairy product',
        quantity: 2,
        status: false,
    });

    const res = await request(app).get('/api/shopping-lists/items/Milk');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('name', 'List 1');
    expect(res.body[1]).toHaveProperty('name', 'List 2');
});

//Test: Search shopping lists by name or description
test('GET /api/shopping-lists/search sollte Einkaufslisten anhand von Namen oder Beschreibung suchen', async () => {
    await request(app).post('/api/shopping-lists').send({
        name: 'Groceries',
        description: 'Weekly grocery shopping',
    });

    await request(app).post('/api/shopping-lists').send({
        name: 'Electronics',
        description: 'Shopping list for electronic items',
    });

    const res = await request(app).get('/api/shopping-lists/search').query({ query: 'grocery' });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('name', 'Groceries');
    expect(res.body[0]).toHaveProperty('description', 'Weekly grocery shopping');
});

// Test: Update the priority of a shopping list
test('PUT /api/shopping-lists/:id/priority sollte die Priorität einer Einkaufsliste aktualisieren', async () => {
    const list = await request(app).post('/api/shopping-lists').send({
        name: 'Test List',
        description: 'This is a test shopping list',
    });

    const res = await request(app)
        .put(`/api/shopping-lists/${list.body.id}/priority`)
        .send({ priority: 1 }); // High Priority

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', list.body.id);
    expect(res.body).toHaveProperty('priority', 1);

    const lists = await request(app).get('/api/shopping-lists');
    expect(lists.body[0]).toHaveProperty('priority', 1);
});
