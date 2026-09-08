import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';
import { ApiResponse, BlogStatus } from '@codexclub/shared';

export class BlogController {
  async list(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { status, category, tag, search, page, limit } = req.query;
      const result = await blogService.listBlogs({
        status: status ? (status as BlogStatus) : BlogStatus.PUBLISHED,
        category: category as string,
        tag: tag as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({
        success: true,
        data: result.blogs,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const blog = await blogService.getBlogBySlug(req.params.slug);
      res.json({
        success: true,
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const blog = await blogService.createBlog(req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.status(201).json({
        success: true,
        message: 'Blog created successfully',
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const updated = await blogService.updateBlog(req.params.id, req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Blog updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await blogService.deleteBlog(req.params.id, {
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

  // --- PROJECT BLOGS ---
  async listProjectBlogs(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { memberId, page, limit } = req.query;
      const result = await blogService.listProjectBlogs({
        memberId: memberId as string,
        status: BlogStatus.PUBLISHED,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });
      res.json({
        success: true,
        data: result.blogs,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  async getProjectBlogBySlug(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const blog = await blogService.getProjectBlogBySlug(req.params.slug);
      res.json({
        success: true,
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  }

  async createProjectBlog(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const blog = await blogService.createProjectBlog(req.body, req.user!.userId);
      res.status(201).json({
        success: true,
        message: 'Project blog created successfully',
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const blogController = new BlogController();

