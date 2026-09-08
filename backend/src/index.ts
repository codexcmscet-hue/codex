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

    app.listen(config.port, () => {
      logger.info(`🚀 CodeX Club API Server running on port ${config.port} [${config.env}]`);
      logger.info(`🔗 Health check available at: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

