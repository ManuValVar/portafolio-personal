const validateMessage = (req, res, next) => {
    const { nombre, email, asunto, mensaje } = req.body;

    if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios',
        });
    }

    if (
        typeof nombre !== 'string' ||
        typeof email !== 'string' ||
        typeof asunto !== 'string' ||
        typeof mensaje !== 'string'
    ) {
        return res.status(400).json({
            success: false,
            message: 'Los datos enviados no son válidos',
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: 'El correo electrónico no es válido',
        });
    }

    if (
        nombre.trim().length > 100 ||
        email.trim().length > 254 ||
        asunto.trim().length > 150 ||
        mensaje.trim().length > 5000
    ) {
        return res.status(400).json({
            success: false,
            message: 'Uno de los campos excede el límite permitido',
        });
    }

    req.body.nombre = nombre.trim();
    req.body.email = email.trim();
    req.body.asunto = asunto.trim();
    req.body.mensaje = mensaje.trim();

    next();
};

export default validateMessage;