import { app } from './app';
import { config } from './config';
import { logger } from './config/logger';
import { connectMongo } from './config/database';
import { connectPostgres } from './config/postgres';

async function bootstrap() {
  try {
    logger.info('Connecting to databases...');
    await connectMongo();
    await connectPostgres();

    const server = app.listen(config.port, () => {
      logger.info(`🚀 CodeX Club API Server running on port ${config.port} [${config.env}]`);
      logger.info(`🔗 Health check available at: http://localhost:${config.port}/api/health`);
    });

    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down API server gracefully...`);
      server.close(() => {
        logger.info('Server closed. Exiting process.');
        process.exit(0);
      });
      // Force exit after 2s if still open
      setTimeout(() => process.exit(0), 2000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

