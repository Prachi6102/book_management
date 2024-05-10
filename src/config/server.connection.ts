import express from "express";
import routes from '../routes';

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// routes
app.use('/', routes);

export default app;