import rateLimit from 'express-rate-limit';

// Limitar los envíos del formulario de contacto
const messageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos

    max: 5, // Máximo 5 solicitudes por IP

    message: {
        success: false,
        message: 'Has enviado demasiados mensajes. Intenta nuevamente en 15 minutos.',
    },

    standardHeaders: true,
    legacyHeaders: false,
});

export default messageLimiter;