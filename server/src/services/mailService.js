import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.resendApiKey);

const escapeHtml = (text) => {
    return text.replace(/[&<>"']/g, (character) => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };

        return entities[character];
    });
};

export const sendContactEmail = async ({ nombre, email, asunto, mensaje }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Portafolio <onboarding@resend.dev>',
            to: [env.contactEmail],
            subject: `Nuevo contacto desde tu portafolio: ${asunto}`,
            replyTo: email,
            text: `
                Has recibido un nuevo mensaje desde tu portafolio.

                Nombre: ${nombre}
                Correo: ${email}
                Asunto: ${asunto}

                Mensaje:
                ${mensaje}
            `,
            html: `
                <h2>Nuevo mensaje desde tu portafolio</h2>

                <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
                <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
                <p><strong>Asunto:</strong> ${escapeHtml(asunto)}</p>

                <h3>Mensaje:</h3>
                <p>${escapeHtml(mensaje).replace(/\n/g, '<br>')}</p>
            `,
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log('Correo enviado correctamente:', data.id);

        return data;
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
        throw error;
    }
};