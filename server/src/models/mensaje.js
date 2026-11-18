import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        asunto: {
            type: String,
            required: true,
            trim: true,
        },

        mensaje: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

export default Mensaje;