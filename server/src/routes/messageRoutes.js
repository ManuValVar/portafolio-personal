import express from 'express';
import { createMessage } from '../controllers/messageController.js';
import validateMessage from '../middlewares/validateMessage.js';

const router = express.Router();

// Ruta para recibir los mensajes del formulario
router.post('/', validateMessage, createMessage);

export default router;