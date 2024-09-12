const cors = require('cors');

// Configuração básica de CORS
const corsOptions = {
    // Aqui você pode especificar as origens permitidas (ou '*')
    origin: 'http://servicedesk:3000/', // Aqui você pode especificar as origens permitidas (ou '*')
    methods: ['GET', 'POST'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'], // Headers permitidos
};

// Exporta o middleware configurado
module.exports = cors(corsOptions);