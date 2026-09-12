import { EventModel } from '../models/event.model';
import { MemberModel } from '../models/member.model';
import { ActivityModel } from '../models/activity.model';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import {
  CreateEventInput,
  UpdateEventInput,
  EventStatus,
  AuditAction,
  Role,
} from '@codexclub/shared';

export class EventService {
  async listEvents(params: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (params.status) query.status = params.status;
    if (params.category) query.category = params.category;
    if (params.search) {
      const regex = new RegExp(params.search, 'i');
      query.$or = [{ title: regex }, { description: regex }, { venue: regex }, { organizer: regex }];
    }

    const [events, total] = await Promise.all([
      EventModel.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EventModel.countDocuments(query),
    ]);

    return {
      events: events.map((e: any) => ({
        id: e._id.toString(),
        title: e.title,
        description: e.description,
        venue: e.venue,
        organizer: e.organizer,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        registrationDeadline: e.registrationDeadline,
        status: e.status,
        category: e.category,
        images: e.images || [],
        participantCount: e.participantIds?.length || 0,
        maxParticipants: e.maxParticipants,
        report: e.report,
        createdBy: e.createdBy,
        createdAt: e.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id: string) {
    const event = await EventModel.findById(id)
      .populate('participantIds', 'displayName username email registrationNumber avatarUrl')
      .lean();

    if (!event) {
      throw new AppError('Event not found', 404);
    }
    return event;
  }

  async createEvent(
    input: CreateEventInput,
    actorInfo: { id: string; role: string; username: string }
  ) {
    const event = await EventModel.create({
      ...input,
      images: [],
      participantIds: [],
      createdBy: actorInfo.id,
    });

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.EVENT_CREATE,
      resourceType: 'event',
      resourceId: event._id.toString(),
      details: { title: event.title, date: event.date },
    });

    return event;
  }

  async updateEvent(
    id: string,
    input: UpdateEventInput,
    actorInfo: { id: string; role: string; username: string }
  ) {
    const event = await EventModel.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    Object.assign(event, input);
    await event.save();

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.EVENT_UPDATE,
      resourceType: 'event',
      resourceId: event._id.toString(),
      details: input,
    });

    return event;
  }

  async deleteEvent(id: string, actorInfo: { id: string; role: string; username: string }) {
    const event = await EventModel.findById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    await EventModel.findByIdAndDelete(id);

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.EVENT_DELETE,
      resourceType: 'event',
      resourceId: id,
      details: { title: event.title },
    });

    return { message: 'Event deleted successfully' };
  }

  async registerParticipant(eventId: string, memberAuthUserId: string) {
    const [event, member] = await Promise.all([
      EventModel.findById(eventId),
      MemberModel.findOne({ authUserId: memberAuthUserId }),
    ]);

    if (!event) throw new AppError('Event not found', 404);
    if (!member) throw new AppError('Member profile not found', 404);

    if (event.participantIds.includes(member._id as any)) {
      throw new AppError('You are already registered for this event', 400);
    }

    if (event.maxParticipants && event.participantIds.length >= event.maxParticipants) {
      throw new AppError('Event has reached maximum participant capacity', 400);
    }

    event.participantIds.push(member._id as any);
    await event.save();

    member.eventsParticipated = (member.eventsParticipated || 0) + 1;
    await member.save();

    await ActivityModel.create({
      memberId: member._id,
      type: 'EVENT_REGISTRATION',
      description: `Registered for event "${event.title}"`,
      points: 15,
      metadata: { eventId: event._id },
    });

    return { message: 'Successfully registered for event' };
  }

  async addEventImage(eventId: string, image: { key: string; url: string; caption?: string }) {
    const event = await EventModel.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    event.images.push(image as any);
    await event.save();
    return event;
  }

  async removeEventImage(eventId: string, imageKey: string) {
    const event = await EventModel.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    event.images = event.images.filter((img: any) => img.key !== imageKey) as any;
    await event.save();
    return event;
  }
}

export const eventService = new EventService();

