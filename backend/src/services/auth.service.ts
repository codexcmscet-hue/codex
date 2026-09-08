import { authRepository } from '../repositories/auth.repository';
import { MemberModel } from '../models/member.model';
import { VolunteerModel } from '../models/volunteer.model';
import { AdminModel } from '../models/admin.model';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, hashToken } from '../utils/jwt';
import { sendEmail } from '../config/email';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import {
  Role,
  AuthUser,
  AuthTokens,
  LoginInput,
  RegisterMemberInput,
  RegisterVolunteerInput,
  AuditAction,
} from '@codexclub/shared';

export class AuthService {
  async registerMember(
    input: RegisterMemberInput,
    clientInfo?: { ip?: string; userAgent?: string }
  ): Promise<{ user: AuthUser; message: string }> {
    // Check if email or username exists in Auth DB
    const [existingEmail, existingUsername] = await Promise.all([
      authRepository.findByEmail(input.email),
      authRepository.findByUsername(input.username),
    ]);

    if (existingEmail) {
      throw new AppError('An account with this email already exists', 409);
    }
    if (existingUsername) {
      throw new AppError('Username is already taken', 409);
    }

    // Check unique constraints in App DB (phone, registration number)
    const [existingReg, existingPhone] = await Promise.all([
      MemberModel.findOne({ registrationNumber: input.registrationNumber }),
      MemberModel.findOne({ phone: input.phone }),
    ]);

    if (existingReg) {
      throw new AppError('Registration number already registered', 409);
    }
    if (existingPhone) {
      throw new AppError('Phone number already registered', 409);
    }

    // Hash password with Argon2id
    const passwordHash = await hashPassword(input.password);

    // Create user in PostgreSQL Auth Database
    const authUser = await authRepository.createUser({
      username: input.username,
      email: input.email,
      passwordHash,
      role: Role.MEMBER,
      emailVerified: false,
    });

    // Create member profile in MongoDB Application Database
    await MemberModel.create({
      authUserId: authUser.id,
      username: input.username,
      email: input.email,
      phone: input.phone,
      registrationNumber: input.registrationNumber,
      displayName: input.displayName,
      creditScore: 5,
    });

    // Create email verification token & send email
    const { token, hash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await authRepository.createEmailVerification(authUser.id, hash, expiresAt);

    const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
    await sendEmail({
      to: authUser.email,
      subject: 'Verify your CodeX Club Account',
      html: `
        <h2>Welcome to CodeX Club, ${input.displayName}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyUrl}" style="background:#22c55e;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Verify Email</a></p>
        <p>Or copy this link: ${verifyUrl}</p>
        <p>This link expires in 24 hours.</p>
      `,
    });

    // Audit log
    await auditService.log({
      actorId: authUser.id,
      actorRole: Role.MEMBER,
      actorName: authUser.username,
      action: AuditAction.MEMBER_CREATE,
      resourceType: 'member',
      resourceId: authUser.id,
      ipAddress: clientInfo?.ip,
      userAgent: clientInfo?.userAgent,
    });

    return {
      user: authUser,
      message: 'Registration successful! Please check your email to verify your account.',
    };
  }

  async login(
    input: LoginInput,
    clientInfo?: { ip?: string; userAgent?: string }
  ): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    // Look up by email or username
    let user = await authRepository.findByEmail(input.identifier);
    if (!user) {
      user = await authRepository.findByUsername(input.identifier);
    }

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check account active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact an administrator.', 403);
    }

    // Check lockout
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const waitMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
      throw new AppError(`Account temporarily locked due to multiple failed login attempts. Try again in ${waitMinutes} minutes.`, 429);
    }

    // Verify password with Argon2id
    const isPasswordValid = await verifyPassword(user.passwordHash, input.password);
    if (!isPasswordValid) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      let lockUntil: Date | undefined;

      if (attempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15-minute lockout
      }

      await authRepository.recordFailedLogin(user.id, lockUntil);

      await auditService.log({
        actorId: user.id,
        actorRole: user.role,
        actorName: user.username,
        action: AuditAction.FAILED_LOGIN,
        resourceType: 'auth',
        result: 'FAILURE',
        details: { attempts },
        ipAddress: clientInfo?.ip,
        userAgent: clientInfo?.userAgent,
      });

      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await authRepository.updateLastLogin(user.id);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const { token: refreshToken, hash: refreshTokenHash } = generateRefreshToken();
    const refreshExpiryDays = input.rememberMe ? 30 : 7;
    const refreshExpiresAt = new Date(Date.now() + refreshExpiryDays * 24 * 60 * 60 * 1000);

    const session = await authRepository.createSession({
      userId: user.id,
      refreshTokenHash,
      ipAddress: clientInfo?.ip,
      userAgent: clientInfo?.userAgent,
      expiresAt: refreshExpiresAt,
    });

    await auditService.log({
      actorId: user.id,
      actorRole: user.role,
      actorName: user.username,
      action: AuditAction.LOGIN,
      resourceType: 'auth',
      resourceId: session.id,
      ipAddress: clientInfo?.ip,
      userAgent: clientInfo?.userAgent,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        lastLogin: new Date(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60, // 15 mins
      },
    };
  }

  async refreshToken(
    oldRefreshToken: string,
    clientInfo?: { ip?: string; userAgent?: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = hashToken(oldRefreshToken);
    const session = await authRepository.findSessionByTokenHash(tokenHash);

    if (!session) {
      throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
    }

    const user = await authRepository.findById(session.userId);
    if (!user || !user.isActive) {
      throw new AppError('User not found or deactivated', 401);
    }

    // Rotate refresh token: delete old session, create new
    await authRepository.deleteSession(session.id);

    const newAccessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const { token: newRefreshToken, hash: newHash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await authRepository.createSession({
      userId: user.id,
      refreshTokenHash: newHash,
      ipAddress: clientInfo?.ip,
      userAgent: clientInfo?.userAgent,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      const session = await authRepository.findSessionByTokenHash(tokenHash);
      if (session) {
        await authRepository.deleteSession(session.id);
      }
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await authRepository.findByEmail(email);
    // Generic response regardless of whether email exists to prevent enumeration
    if (!user) return;

    const { token, hash } = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await authRepository.createPasswordReset(user.id, hash, expiresAt);

    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: 'CodeX Club — Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset the password for your CodeX Club account.</p>
        <p><a href="${resetUrl}" style="background:#3b82f6;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a></p>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
      `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = hashToken(token);
    const reset = await authRepository.findPasswordReset(tokenHash);

    if (!reset || reset.used || new Date(reset.expiresAt) < new Date()) {
      throw new AppError('Invalid or expired password reset link.', 400);
    }

    const passwordHash = await hashPassword(newPassword);
    await authRepository.updatePassword(reset.userId, passwordHash);
    await authRepository.markPasswordResetUsed(reset.id);

    // Invalidate all active sessions for security
    await authRepository.deleteUserSessions(reset.userId);

    await auditService.log({
      actorId: reset.userId,
      actorRole: 'UNKNOWN',
      action: AuditAction.PASSWORD_RESET_COMPLETE,
      resourceType: 'auth',
      resourceId: reset.userId,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    const record = await authRepository.findEmailVerification(tokenHash);

    if (!record || record.used || new Date(record.expiresAt) < new Date()) {
      throw new AppError('Invalid or expired email verification link.', 400);
    }

    await authRepository.setEmailVerified(record.userId);
    await authRepository.markEmailVerificationUsed(record.id);
  }
}

export const authService = new AuthService();
