import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/event.service';
import { ApiResponse } from '@codexclub/shared';

export class EventController {
  async list(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { search, status, category, page, limit } = req.query;
      const result = await eventService.listEvents({
        search: search as string,
        status: status as string,
        category: category as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({
        success: true,
        data: result.events,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.getEventById(req.params.id);
      res.json({
        success: true,
        data: event,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.createEvent(req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const updated = await eventService.updateEvent(req.params.id, req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Event updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await eventService.deleteEvent(req.params.id, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await eventService.registerParticipant(req.params.id, req.user!.userId);
      res.json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  async addImage(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.addEventImage(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Image added to event',
        data: event,
      });
    } catch (err) {
      next(err);
    }
  }

  async removeImage(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.removeEventImage(req.params.id, req.params.imageKey);
      res.json({
        success: true,
        message: 'Image removed from event',
        data: event,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const eventController = new EventController();

