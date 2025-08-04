const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GYM MVP API',
      version: '1.0.0',
      description: 'API Documentation for the GYM MVP backend',
    },
    servers: [
      {
        url: 'https://gym-mvp-server.onrender.com',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };