// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace Challenge API',
      version: '1.0.0',
      description: 'Online marketplace that allows the process of buying and selling of products and process orders',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000', // Change to your server URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Files containing annotations for the OpenAPI Specification
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
