import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { env } from './src/config/env.js';

const startServer = async () => {
    try {
        // Conectar con MongoDB
        await connectDB();

        // Iniciar servidor
        app.listen(env.port, () => {
            console.log(`Server running on port ${env.port}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
}
};

startServer();