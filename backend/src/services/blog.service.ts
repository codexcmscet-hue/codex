import DOMPurify from 'isomorphic-dompurify';
import { blogRepository } from '../repositories/blog.repository';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import {
  CreateBlogInput,
  UpdateBlogInput,
  CreateProjectBlogInput,
  UpdateProjectBlogInput,
  BlogStatus,
  AuditAction,
  Role,
} from '@codexclub/shared';

function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.random().toString(36).substring(2, 7)
  );
}

function sanitizeHtml(rawHtml: string): string {
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'strong', 'em', 'strike',
      'code', 'pre', 'hr', 'br', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table',
      'thead', 'tbody', 'tr', 'th', 'td', 'span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
  });
}

export class BlogService {
  async listBlogs(params: {
    status?: BlogStatus;
    category?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return await blogRepository.listBlogs(params);
  }

  async getBlogBySlug(slug: string) {
    const blog = await blogRepository.getBlogBySlug(slug);
    if (!blog) throw new AppError('Blog post not found', 404);
    return blog;
  }

  async createBlog(
    input: CreateBlogInput,
    authorInfo: { id: string; role: string; username: string }
  ) {
    const slug = generateSlug(input.title);
    const sanitizedContent = sanitizeHtml(input.content);
    const publishedAt = input.status === BlogStatus.PUBLISHED ? new Date() : null;

    const blog = await blogRepository.createBlog({
      title: input.title,
      slug,
      content: sanitizedContent,
      excerpt: input.excerpt || input.content.substring(0, 150) + '...',
      coverImageUrl: input.coverImageUrl,
      authorId: authorInfo.id,
      authorName: authorInfo.username,
      authorRole: authorInfo.role,
      category: input.category,
      tags: input.tags,
      status: input.status,
      publishedAt,
    });

    await auditService.log({
      actorId: authorInfo.id,
      actorRole: authorInfo.role,
      actorName: authorInfo.username,
      action: AuditAction.BLOG_CREATE,
      resourceType: 'blog',
      resourceId: blog.id,
      details: { title: blog.title, status: blog.status },
    });

    return blog;
  }

  async updateBlog(
    id: string,
    input: UpdateBlogInput,
    actorInfo: { id: string; role: string; username: string }
  ) {
    const existing = await blogRepository.getBlogById(id);
    if (!existing) throw new AppError('Blog not found', 404);

    // Only Admin or the author volunteer can edit
    if (actorInfo.role !== Role.ADMIN && existing.authorId !== actorInfo.id) {
      throw new AppError('You do not have permission to edit this blog', 403);
    }

    const updates: any = { ...input };
    if (input.content) {
      updates.content = sanitizeHtml(input.content);
    }

    const updated = await blogRepository.updateBlog(id, updates);

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.BLOG_UPDATE,
      resourceType: 'blog',
      resourceId: id,
      details: input,
    });

    return updated;
  }

  async deleteBlog(id: string, actorInfo: { id: string; role: string; username: string }) {
    const existing = await blogRepository.getBlogById(id);
    if (!existing) throw new AppError('Blog not found', 404);

    if (actorInfo.role !== Role.ADMIN && existing.authorId !== actorInfo.id) {
      throw new AppError('You do not have permission to delete this blog', 403);
    }

    await blogRepository.deleteBlog(id);

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.BLOG_DELETE,
      resourceType: 'blog',
      resourceId: id,
      details: { title: existing.title },
    });

    return { message: 'Blog deleted successfully' };
  }

  // --- PROJECT BLOGS ---
  async listProjectBlogs(params: { memberId?: string; status?: BlogStatus; page?: number; limit?: number }) {
    return await blogRepository.listProjectBlogs(params);
  }

  async getProjectBlogBySlug(slug: string) {
    const blog = await blogRepository.getProjectBlogBySlug(slug);
    if (!blog) throw new AppError('Project blog not found', 404);
    return blog;
  }

  async createProjectBlog(
    input: CreateProjectBlogInput,
    memberAuthUserId: string
  ) {
    const slug = generateSlug(input.projectTitle + '-' + input.blogTitle);
    const sanitizedDetails = sanitizeHtml(input.projectDetails);
    const sanitizedDesc = sanitizeHtml(input.description);

    const blog = await blogRepository.createProjectBlog({
      memberId: memberAuthUserId,
      projectTitle: input.projectTitle,
      blogTitle: input.blogTitle,
      slug,
      description: sanitizedDesc,
      projectDetails: sanitizedDetails,
      technologies: input.technologies,
      githubUrl: input.githubUrl,
      demoUrl: input.demoUrl,
      images: input.images,
      tags: input.tags,
      status: input.status,
    });

    await auditService.log({
      actorId: memberAuthUserId,
      actorRole: Role.MEMBER,
      action: AuditAction.BLOG_CREATE,
      resourceType: 'project_blog',
      resourceId: blog.id,
      details: { projectTitle: blog.projectTitle },
    });

    return blog;
  }
}

export const blogService = new BlogService();

