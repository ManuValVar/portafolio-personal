import 'dotenv/config';

const requiredVars = [
    'MONGOB_USERNAME',
    'MONGOB_PASSWORD',
    'MONGOB_CLUSTER',
    'RESEND_API_KEY',
    'CONTACT_EMAIL',
];

const missingVars = requiredVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
}

export const env = {
    port: process.env.PORT || 3000,

    mongodbUri: `mongodb+srv://${encodeURIComponent(process.env.MONGOB_USERNAME)}:${encodeURIComponent(process.env.MONGOB_PASSWORD)}@${process.env.MONGOB_CLUSTER}/portafolio?retryWrites=true&w=majority`,

    resendApiKey: process.env.RESEND_API_KEY,
    contactEmail: process.env.CONTACT_EMAIL,

    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
        : [],
};