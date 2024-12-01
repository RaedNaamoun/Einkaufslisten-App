CREATE TABLE IF NOT EXISTS shopping_lists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 3,
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
    PRIMARY KEY (shopping_list_id, item_id),
    quantity INT,
    status BOOLEAN DEFAULT FALSE
);