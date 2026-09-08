import { pgPool } from '../config/postgres';
import { AuthUser, Session, Role } from '@codexclub/shared';

export class AuthRepository {
  async createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
    role: Role;
    emailVerified?: boolean;
  }): Promise<AuthUser> {
    const query = `
      INSERT INTO auth.users (username, email, password_hash, role, email_verified)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, email_verified as "emailVerified", role, is_active as "isActive",
                last_login as "lastLogin", last_password_change as "lastPasswordChange",
                created_at as "createdAt", updated_at as "updatedAt";
    `;
    const values = [data.username, data.email, data.passwordHash, data.role, data.emailVerified ?? false];
    const res = await pgPool.query(query, values);
    return res.rows[0];
  }

  async findByEmail(email: string): Promise<(AuthUser & { passwordHash: string; failedLoginAttempts: number; lockedUntil?: Date }) | null> {
    const query = `
      SELECT id, username, email, email_verified as "emailVerified", password_hash as "passwordHash",
             role, is_active as "isActive", failed_login_attempts as "failedLoginAttempts",
             locked_until as "lockedUntil", last_login as "lastLogin",
             last_password_change as "lastPasswordChange", created_at as "createdAt", updated_at as "updatedAt"
      FROM auth.users
      WHERE LOWER(email) = LOWER($1);
    `;
    const res = await pgPool.query(query, [email]);
    return res.rows[0] || null;
  }

  async findByUsername(username: string): Promise<(AuthUser & { passwordHash: string; failedLoginAttempts: number; lockedUntil?: Date }) | null> {
    const query = `
      SELECT id, username, email, email_verified as "emailVerified", password_hash as "passwordHash",
             role, is_active as "isActive", failed_login_attempts as "failedLoginAttempts",
             locked_until as "lockedUntil", last_login as "lastLogin",
             last_password_change as "lastPasswordChange", created_at as "createdAt", updated_at as "updatedAt"
      FROM auth.users
      WHERE LOWER(username) = LOWER($1);
    `;
    const res = await pgPool.query(query, [username]);
    return res.rows[0] || null;
  }

  async findById(id: string): Promise<AuthUser | null> {
    const query = `
      SELECT id, username, email, email_verified as "emailVerified", role, is_active as "isActive",
             last_login as "lastLogin", last_password_change as "lastPasswordChange",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM auth.users
      WHERE id = $1;
    `;
    const res = await pgPool.query(query, [id]);
    return res.rows[0] || null;
  }

  async updateLastLogin(id: string): Promise<void> {
    await pgPool.query(
      'UPDATE auth.users SET last_login = NOW(), failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
      [id]
    );
  }

  async recordFailedLogin(id: string, lockUntil?: Date): Promise<void> {
    await pgPool.query(
      'UPDATE auth.users SET failed_login_attempts = failed_login_attempts + 1, locked_until = $2 WHERE id = $1',
      [id, lockUntil || null]
    );
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await pgPool.query(
      'UPDATE auth.users SET password_hash = $1, last_password_change = NOW(), updated_at = NOW() WHERE id = $2',
      [passwordHash, id]
    );
  }

  async setEmailVerified(id: string): Promise<void> {
    await pgPool.query('UPDATE auth.users SET email_verified = TRUE, updated_at = NOW() WHERE id = $1', [id]);
  }

  async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }): Promise<Session> {
    const query = `
      INSERT INTO auth.sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id as "userId", refresh_token_hash as "refreshTokenHash",
                ip_address as "ipAddress", user_agent as "userAgent",
                expires_at as "expiresAt", created_at as "createdAt";
    `;
    const res = await pgPool.query(query, [
      data.userId,
      data.refreshTokenHash,
      data.ipAddress || null,
      data.userAgent || null,
      data.expiresAt,
    ]);
    return res.rows[0];
  }

  async findSessionByTokenHash(refreshTokenHash: string): Promise<Session | null> {
    const query = `
      SELECT id, user_id as "userId", refresh_token_hash as "refreshTokenHash",
             expires_at as "expiresAt", created_at as "createdAt"
      FROM auth.sessions
      WHERE refresh_token_hash = $1 AND expires_at > NOW();
    `;
    const res = await pgPool.query(query, [refreshTokenHash]);
    return res.rows[0] || null;
  }

  async deleteSession(id: string): Promise<void> {
    await pgPool.query('DELETE FROM auth.sessions WHERE id = $1', [id]);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await pgPool.query('DELETE FROM auth.sessions WHERE user_id = $1', [userId]);
  }

  async createPasswordReset(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await pgPool.query(
      'INSERT INTO auth.password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [userId, tokenHash, expiresAt]
    );
  }

  async findPasswordReset(tokenHash: string): Promise<{ id: string; userId: string; expiresAt: Date; used: boolean } | null> {
    const res = await pgPool.query(
      'SELECT id, user_id as "userId", expires_at as "expiresAt", used FROM auth.password_resets WHERE token_hash = $1',
      [tokenHash]
    );
    return res.rows[0] || null;
  }

  async markPasswordResetUsed(id: string): Promise<void> {
    await pgPool.query('UPDATE auth.password_resets SET used = TRUE WHERE id = $1', [id]);
  }

  async createEmailVerification(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await pgPool.query(
      'INSERT INTO auth.email_verifications (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [userId, tokenHash, expiresAt]
    );
  }

  async findEmailVerification(tokenHash: string): Promise<{ id: string; userId: string; expiresAt: Date; used: boolean } | null> {
    const res = await pgPool.query(
      'SELECT id, user_id as "userId", expires_at as "expiresAt", used FROM auth.email_verifications WHERE token_hash = $1',
      [tokenHash]
    );
    return res.rows[0] || null;
  }

  async markEmailVerificationUsed(id: string): Promise<void> {
    await pgPool.query('UPDATE auth.email_verifications SET used = TRUE WHERE id = $1', [id]);
  }
}

export const authRepository = new AuthRepository();
