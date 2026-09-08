import fs from 'fs';
import path from 'path';
import { pgPool } from '../config/postgres';
import { logger } from '../config/logger';

export async function runMigrations() {
  try {
    const sqlPath = path.resolve(__dirname, 'migrations/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    logger.info('Running PostgreSQL database migrations...');
    await pgPool.query(sql);
    logger.info('✅ Database migrations applied successfully!');
  } catch (err) {
    logger.error('Database migration failed:', err);
    throw err;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

