const errorHandler = (err, req, res, next) => {
    console.error('Error en el servidor:', err.message);

    return res.status(500).json({
        success: false,
        message: 'Ha ocurrido un error interno en el servidor',
    });
};

export default errorHandler;