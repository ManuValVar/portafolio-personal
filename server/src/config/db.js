import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.mongodbUri);

        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
};