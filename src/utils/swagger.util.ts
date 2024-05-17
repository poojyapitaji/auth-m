import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      version
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/v1/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (
  app: Express,
  port: string | number,
  apiVersion: string
) => {
  // Swagger page
  app.use(`${apiVersion}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get(`${apiVersion}/docs.json`, (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`For API docs open https://localhost:${port}/${apiVersion}/docs`);
};

export default swaggerDocs;
