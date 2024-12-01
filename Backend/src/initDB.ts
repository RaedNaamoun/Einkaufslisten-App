import { readFileSync } from 'fs';
import path from 'path';
import pool from './db';

export async function initializeDatabase() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf-8'); // Read SQL file
        await pool.query(schema); // Execute SQL
        console.log('Datenbank erfolgreich initialisiert.');
    } catch (error) {
        console.error('Fehler bei der Initialisierung der Datenbank:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}