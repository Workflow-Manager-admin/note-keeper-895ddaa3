const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'A notes REST API with CRUD and search, documented with Swagger',
    },
    components: {
      schemas: {
        Note: {
          type: 'object',
          required: ['id', 'title', 'content', 'created_at', 'updated_at'],
          properties: {
            id: { type: 'integer', example: 1, description: 'Note unique ID' },
            title: { type: 'string', example: 'Meeting notes', description: 'Note title' },
            content: { type: 'string', example: 'Discussed project status...', description: 'Note content' },
            created_at: { type: 'string', format: 'date-time', example: '2024-03-01T13:00:01Z', description: 'Creation timestamp' },
            updated_at: { type: 'string', format: 'date-time', example: '2024-03-02T09:12:43Z', description: 'Last update timestamp' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
