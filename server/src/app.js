import express from "express";
import cors from "cors";
import messageRoutes from './routes/messageRoutes.js';
import messageLimiter from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import { env } from './config/env.js';


const app = express();

// Configuración de CORS
app.use(cors({
    origin: env.allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));


// Permitir recibir datos en formato JSON
app.use(express.json());

// Ruta principal para comprobar que el servidor funciona
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API del portafolio funcionando correctamente',
    });
});

// Ruta para recibir mensajes del formulario de contacto
app.use('/api/messages', messageLimiter, messageRoutes);


// Middleware para manejar errores
app.use(errorHandler);

export default app;