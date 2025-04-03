import { SwaggerRegistry } from '../decorators/swagger.decorator';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Express Meta API',
    version: '1.0.0',
    description: 'API documentation for Express Meta application',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  tags: SwaggerRegistry.getInstance().getTags(),
  paths: SwaggerRegistry.getInstance().getPaths(),
  components: {
    securitySchemes: {
      Bearer: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}; 