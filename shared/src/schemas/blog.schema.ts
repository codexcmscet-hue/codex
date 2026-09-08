import { z } from 'zod';
import { BlogStatus } from '../types/blog.types';

export const CreateBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200).trim(),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  excerpt: z.string().max(300).trim().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().max(50).trim().optional(),
  tags: z.array(z.string().trim()).max(10).optional().default([]),
  status: z.nativeEnum(BlogStatus).optional().default(BlogStatus.DRAFT),
});

export const UpdateBlogSchema = CreateBlogSchema.partial();

export const CreateProjectBlogSchema = z.object({
  projectTitle: z.string().min(2).max(200).trim(),
  blogTitle: z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(1000).trim(),
  projectDetails: z.string().min(20),
  technologies: z.array(z.string().trim()).min(1, 'Select at least one technology'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).max(5).optional().default([]),
  tags: z.array(z.string().trim()).max(10).optional().default([]),
  status: z.nativeEnum(BlogStatus).optional().default(BlogStatus.DRAFT),
});

export const UpdateProjectBlogSchema = CreateProjectBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
export type CreateProjectBlogInput = z.infer<typeof CreateProjectBlogSchema>;
export type UpdateProjectBlogInput = z.infer<typeof UpdateProjectBlogSchema>;
