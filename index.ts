import { connectToDatabase } from './src/config/db.connection';
import app from './src/config/server.connection';
import dotenv from 'dotenv';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000');

connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`)
    });
}).catch((error: any) => {
    console.error('Failed to start the server:', error);
})
