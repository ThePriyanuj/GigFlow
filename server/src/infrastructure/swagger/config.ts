import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GigFlow - Smart Leads Dashboard API',
      version: '1.0.0',
      description: 'RESTful API for managing sales leads with authentication, RBAC, filtering, and CSV export.',
      contact: {
        name: 'GigFlow Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Leads', description: 'Lead management endpoints' },
    ],
  },
  apis: ['./src/interface/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
