import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './src/routes';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '3000');
const MONGODB_URI: string = process.env.MONGODB_URI || '';

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// routes
app.use('/', routes);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to database!');
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`)
        });
    }).catch((error: any) => {
        console.log('Failed to connect!', error);
    })
