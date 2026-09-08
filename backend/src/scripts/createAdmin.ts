import readline from 'readline';
import { authRepository } from '../repositories/auth.repository';
import { AdminModel } from '../models/admin.model';
import { hashPassword } from '../utils/password';
import { connectMongo, disconnectMongo } from '../config/database';
import { connectPostgres, pgPool } from '../config/postgres';
import { Role, PasswordSchema, UsernameSchema, EmailSchema } from '@codexclub/shared';
import { logger } from '../config/logger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('\n=== CodeX Club Initial Administrator Creation ===\n');

  try {
    await connectMongo();
    await connectPostgres();

    const username = (await question('Enter Admin Username (min 3 chars): ')).trim();
    UsernameSchema.parse(username);

    const email = (await question('Enter Admin Email: ')).trim();
    EmailSchema.parse(email);

    const displayName = (await question('Enter Admin Display Name: ')).trim();
    if (!displayName) throw new Error('Display name is required');

    const password = await question('Enter Admin Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special): ');
    PasswordSchema.parse(password);

    // Check if user already exists
    const [existingEmail, existingUsername] = await Promise.all([
      authRepository.findByEmail(email),
      authRepository.findByUsername(username),
    ]);

    if (existingEmail || existingUsername) {
      console.error('\n❌ An account with this email or username already exists.\n');
      process.exit(1);
    }

    const passwordHash = await hashPassword(password);

    const authUser = await authRepository.createUser({
      username,
      email,
      passwordHash,
      role: Role.ADMIN,
      emailVerified: true,
    });

    await AdminModel.create({
      authUserId: authUser.id,
      username,
      email,
      displayName,
    });

    console.log('\n✅ Initial Administrator account successfully created!');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Role: ADMIN`);
    console.log('\nYou can now log in at: /admin/login\n');
  } catch (err: any) {
    console.error('\n❌ Admin creation failed:', err.message || err);
  } finally {
    rl.close();
    await disconnectMongo();
    await pgPool.end();
    process.exit(0);
  }
}

createAdmin();

