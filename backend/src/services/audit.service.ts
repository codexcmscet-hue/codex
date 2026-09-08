import { AuditLogModel } from '../models/auditLog.model';
import { AuditAction } from '@codexclub/shared';
import { logger } from '../config/logger';

export class AuditService {
  async log(data: {
    actorId: string;
    actorRole: string;
    actorName?: string;
    action: AuditAction;
    resourceType: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    result?: 'SUCCESS' | 'FAILURE';
  }): Promise<void> {
    try {
      await AuditLogModel.create({
        actorId: data.actorId,
        actorRole: data.actorRole,
        actorName: data.actorName || '',
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId || null,
        details: data.details || {},
        ipAddress: data.ipAddress || '',
        userAgent: data.userAgent || '',
        result: data.result || 'SUCCESS',
        timestamp: new Date(),
      });
    } catch (err) {
      logger.error('Failed to create audit log entry:', err);
    }
  }

  async getLogs(params: {
    page?: number;
    limit?: number;
    action?: string;
    actorRole?: string;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (params.action) filter.action = params.action;
    if (params.actorRole) filter.actorRole = params.actorRole;
    if (params.resourceType) filter.resourceType = params.resourceType;
    if (params.startDate || params.endDate) {
      filter.timestamp = {};
      if (params.startDate) filter.timestamp.$gte = new Date(params.startDate);
      if (params.endDate) filter.timestamp.$lte = new Date(params.endDate);
    }

    const [logs, total] = await Promise.all([
      AuditLogModel.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      AuditLogModel.countDocuments(filter),
    ]);

    return {
      logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
