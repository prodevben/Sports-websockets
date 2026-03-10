import express from "express";
import { db } from "./db/client.js";
import userRoutes from "./controllers/userController.js";

const app = express();
const PORT = 8000;

// JSON middleware
app.use(express.json());

// User routes
app.use('/users', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express' });
});

// Start server and log URL
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});