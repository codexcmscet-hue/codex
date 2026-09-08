import { describe, it, expect, vi } from 'vitest';
import { hashPassword, verifyPassword } from '../src/utils/password';
import { generateAccessToken, verifyAccessToken, generateRefreshToken, hashToken } from '../src/utils/jwt';
import { Role } from '@codexclub/shared';
import { CreditScoreSchema } from '@codexclub/shared';
import { UsernameSchema, EmailSchema, PasswordSchema } from '@codexclub/shared';

describe('Auth & Cryptography Unit Tests', () => {
  it('should hash passwords with Argon2id and verify correctly', async () => {
    const plain = 'SecretP@ssw0rd123!';
    const hash = await hashPassword(plain);

    expect(hash).toContain('$argon2id$');
    const isValid = await verifyPassword(hash, plain);
    expect(isValid).toBe(true);

    const isWrong = await verifyPassword(hash, 'WrongPassword123!');
    expect(isWrong).toBe(false);
  });

  it('should generate and verify valid JWT access tokens', () => {
    const payload = {
      userId: 'user-123',
      username: 'testuser',
      email: 'test@codex.edu',
      role: Role.MEMBER,
    };

    const token = generateAccessToken(payload);
    expect(token).toBeTypeOf('string');

    const decoded = verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.role).toBe(Role.MEMBER);
  });

  it('should hash refresh tokens deterministically with SHA256', () => {
    const { token, hash } = generateRefreshToken();
    const computedHash = hashToken(token);
    expect(hash).toBe(computedHash);
  });
});

describe('Validation Schema Security Tests', () => {
  it('should enforce strict credit score integer bounds (0-10)', () => {
    expect(() => CreditScoreSchema.parse(0)).not.toThrow();
    expect(() => CreditScoreSchema.parse(10)).not.toThrow();
    expect(() => CreditScoreSchema.parse(5)).not.toThrow();

    expect(() => CreditScoreSchema.parse(-1)).toThrow();
    expect(() => CreditScoreSchema.parse(11)).toThrow();
    expect(() => CreditScoreSchema.parse(7.5)).toThrow(); // Decimals rejected
    expect(() => CreditScoreSchema.parse('5' as any)).toThrow();
  });

  it('should validate usernames against injection characters', () => {
    expect(() => UsernameSchema.parse('valid_user123')).not.toThrow();
    expect(() => UsernameSchema.parse('user$name')).toThrow();
    expect(() => UsernameSchema.parse('user<script>')).toThrow();
    expect(() => UsernameSchema.parse('ab')).toThrow(); // Too short
  });

  it('should require strong passwords', () => {
    expect(() => PasswordSchema.parse('CodexClub@2026')).not.toThrow();
    expect(() => PasswordSchema.parse('password')).toThrow(); // No upper, number, special
    expect(() => PasswordSchema.parse('Short1!')).toThrow(); // Under 8 chars
  });
});

