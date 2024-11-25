import express from 'express';
import routes from './routes';
import { initializeDatabase } from './initDB';

const app = express();
app.use(express.json());

initializeDatabase();

app.use('/api', routes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});