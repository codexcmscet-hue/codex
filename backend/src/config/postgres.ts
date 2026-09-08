import { Pool } from 'pg';
import { config } from './index';
import { logger } from './logger';

export const pgPool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pgPool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

export async function connectPostgres(): Promise<void> {
  try {
    const client = await pgPool.connect();
    const res = await client.query('SELECT current_database(), current_schema()');
    client.release();
    logger.info(`PostgreSQL connected to DB: ${res.rows[0].current_database}`);
  } catch (error) {
    logger.error('PostgreSQL connection error:', error);
    throw error;
  }
}
