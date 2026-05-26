const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'foodZeep API',
      version: '1.0.0',
      description: 'Food Delivery Application API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
    // ADD THE PATHS DIRECTLY HERE: This prevents YAML duplication completely!
    paths: {
      '/auth/login': {
        post: {
          summary: 'Login user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'admin@gmail.com' },
                    password: { type: 'string', example: 'admin123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/auth/refresh': {
        post: {
          summary: 'Refresh Access Token',
          tags: ['Auth'],
          responses: {
            200: { description: 'Token rotated successfully' },
            401: { description: 'Session expired' }
          }
        }
      },
      '/auth/logout': {
        post: {
          summary: 'Secure Logout',
          tags: ['Auth'],
          responses: {
            200: { description: 'Logged out successfully' }
          }
        }
      }
    }
  },
  // Ensure your apis array only points to files that DO NOT contain duplicate comments
  apis: ['./src/modules/**/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;