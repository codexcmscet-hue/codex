import { Role } from '../constants/roles';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  lastPasswordChange?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  refreshTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
  role: Role;
  sessionId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: Role;
    emailVerified: boolean;
  };
  tokens?: AuthTokens;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface EmailVerificationToken {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}
