import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth-m Apis',
      version: '1.0.0',
      description: 'API documentation using Swagger'
    }
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);

export default { serve: swaggerUi.serve, setup: swaggerUi.setup(specs) };
