import { readFileSync } from 'fs';
import path from 'path';
import pool from './db';

export async function initializeDatabase() {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf-8'); // SQL-Datei lesen
        await pool.query(schema); // SQL ausführen
        console.log('Datenbank erfolgreich initialisiert.');
    } catch (error) {
        console.error('Fehler bei der Initialisierung der Datenbank:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}