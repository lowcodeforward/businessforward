const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BusinessForward Gateway API',
      version: '1.0.0',
      description: 'API REST para autenticação e gestão de usuários, produtos e pedidos.'
    },
    servers: [
      {
        url: process.env.APP_URL ? `${process.env.APP_URL}/api` : 'http://localhost:4000/api'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
