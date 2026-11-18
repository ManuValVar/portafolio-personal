import Mensaje from '../models/mensaje.js';
import { sendContactEmail } from '../services/mailService.js';

export const createMessage = async (req, res, next) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;

        // Guardar el mensaje en MongoDB
        const newMessage = await Mensaje.create({
            nombre,
            email,
            asunto,
            mensaje,
        });

        // Enviar notificación al correo
        try {
            await sendContactEmail({
                nombre,
                email,
                asunto,
                mensaje,
            });
        } catch (emailError) {
            console.error(
                'El mensaje se guardó, pero no se pudo enviar el correo:',
                emailError.message
            );
        }

        // Responder al frontend
        return res.status(201).json({
            success: true,
            message: 'Mensaje enviado correctamente',
            data: {
                id: newMessage._id,
            },
        });

    } catch (error) {
        next(error);
    }
};