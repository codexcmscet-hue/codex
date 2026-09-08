import { pgPool } from '../config/postgres';
import { Blog, ProjectBlog, BlogStatus } from '@codexclub/shared';

export class BlogRepository {
  async listBlogs(params: {
    status?: BlogStatus;
    category?: string;
    tag?: string;
    authorId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (params.status) {
      conditions.push(`status = $${paramIndex++}`);
      values.push(params.status);
    }
    if (params.category) {
      conditions.push(`category = $${paramIndex++}`);
      values.push(params.category);
    }
    if (params.authorId) {
      conditions.push(`author_id = $${paramIndex++}`);
      values.push(params.authorId);
    }
    if (params.tag) {
      conditions.push(`$${paramIndex++} = ANY(tags)`);
      values.push(params.tag);
    }
    if (params.search) {
      conditions.push(`(title ILIKE $${paramIndex} OR excerpt ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
      values.push(`%${params.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT id, title, slug, content, excerpt, cover_image_url as "coverImageUrl",
             author_id as "authorId", author_name as "authorName", author_role as "authorRole",
             status, category, tags, views, published_at as "publishedAt",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM content.blogs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;

    const countQuery = `SELECT COUNT(*) FROM content.blogs ${whereClause};`;

    const [dataRes, countRes] = await Promise.all([
      pgPool.query(query, [...values, limit, offset]),
      pgPool.query(countQuery, values),
    ]);

    const total = parseInt(countRes.rows[0].count, 10);

    return {
      blogs: dataRes.rows,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const query = `
      SELECT id, title, slug, content, excerpt, cover_image_url as "coverImageUrl",
             author_id as "authorId", author_name as "authorName", author_role as "authorRole",
             status, category, tags, views, published_at as "publishedAt",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM content.blogs
      WHERE slug = $1;
    `;
    const res = await pgPool.query(query, [slug]);
    if (res.rows[0]) {
      // Increment views
      await pgPool.query('UPDATE content.blogs SET views = views + 1 WHERE slug = $1', [slug]);
    }
    return res.rows[0] || null;
  }

  async getBlogById(id: string): Promise<Blog | null> {
    const query = `
      SELECT id, title, slug, content, excerpt, cover_image_url as "coverImageUrl",
             author_id as "authorId", author_name as "authorName", author_role as "authorRole",
             status, category, tags, views, published_at as "publishedAt",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM content.blogs
      WHERE id = $1;
    `;
    const res = await pgPool.query(query, [id]);
    return res.rows[0] || null;
  }

  async createBlog(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImageUrl?: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    category?: string;
    tags?: string[];
    status?: BlogStatus;
    publishedAt?: Date | null;
  }): Promise<Blog> {
    const query = `
      INSERT INTO content.blogs (title, slug, content, excerpt, cover_image_url, author_id, author_name, author_role, category, tags, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, title, slug, content, excerpt, cover_image_url as "coverImageUrl",
                author_id as "authorId", author_name as "authorName", author_role as "authorRole",
                status, category, tags, views, published_at as "publishedAt",
                created_at as "createdAt", updated_at as "updatedAt";
    `;
    const res = await pgPool.query(query, [
      data.title,
      data.slug,
      data.content,
      data.excerpt || null,
      data.coverImageUrl || null,
      data.authorId,
      data.authorName,
      data.authorRole,
      data.category || null,
      data.tags || [],
      data.status || BlogStatus.DRAFT,
      data.publishedAt || null,
    ]);
    return res.rows[0];
  }

  async updateBlog(id: string, data: Partial<Blog>): Promise<Blog | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) { updates.push(`title = $${idx++}`); values.push(data.title); }
    if (data.slug !== undefined) { updates.push(`slug = $${idx++}`); values.push(data.slug); }
    if (data.content !== undefined) { updates.push(`content = $${idx++}`); values.push(data.content); }
    if (data.excerpt !== undefined) { updates.push(`excerpt = $${idx++}`); values.push(data.excerpt); }
    if (data.coverImageUrl !== undefined) { updates.push(`cover_image_url = $${idx++}`); values.push(data.coverImageUrl); }
    if (data.category !== undefined) { updates.push(`category = $${idx++}`); values.push(data.category); }
    if (data.tags !== undefined) { updates.push(`tags = $${idx++}`); values.push(data.tags); }
    if (data.status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(data.status);
      if (data.status === BlogStatus.PUBLISHED) {
        updates.push(`published_at = NOW()`);
      }
    }

    if (updates.length === 0) return this.getBlogById(id);

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE content.blogs
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING id, title, slug, content, excerpt, cover_image_url as "coverImageUrl",
                author_id as "authorId", author_name as "authorName", author_role as "authorRole",
                status, category, tags, views, published_at as "publishedAt",
                created_at as "createdAt", updated_at as "updatedAt";
    `;

    const res = await pgPool.query(query, values);
    return res.rows[0] || null;
  }

  async deleteBlog(id: string): Promise<void> {
    await pgPool.query('DELETE FROM content.blogs WHERE id = $1', [id]);
  }

  // --- PROJECT BLOGS ---
  async listProjectBlogs(params: { memberId?: string; status?: BlogStatus; page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (params.memberId) { conditions.push(`member_id = $${idx++}`); values.push(params.memberId); }
    if (params.status) { conditions.push(`status = $${idx++}`); values.push(params.status); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT id, member_id as "memberId", project_title as "projectTitle", blog_title as "blogTitle",
             slug, description, project_details as "projectDetails", technologies,
             github_url as "githubUrl", demo_url as "demoUrl", images, tags, status,
             published_at as "publishedAt", created_at as "createdAt", updated_at as "updatedAt"
      FROM content.project_blogs
      ${where}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx++};
    `;

    const countQuery = `SELECT COUNT(*) FROM content.project_blogs ${where};`;

    const [dataRes, countRes] = await Promise.all([
      pgPool.query(query, [...values, limit, offset]),
      pgPool.query(countQuery, values),
    ]);

    return {
      blogs: dataRes.rows,
      meta: {
        page,
        limit,
        total: parseInt(countRes.rows[0].count, 10),
        totalPages: Math.ceil(parseInt(countRes.rows[0].count, 10) / limit),
      },
    };
  }

  async getProjectBlogBySlug(slug: string): Promise<ProjectBlog | null> {
    const query = `
      SELECT id, member_id as "memberId", project_title as "projectTitle", blog_title as "blogTitle",
             slug, description, project_details as "projectDetails", technologies,
             github_url as "githubUrl", demo_url as "demoUrl", images, tags, status,
             published_at as "publishedAt", created_at as "createdAt", updated_at as "updatedAt"
      FROM content.project_blogs
      WHERE slug = $1;
    `;
    const res = await pgPool.query(query, [slug]);
    return res.rows[0] || null;
  }

  async createProjectBlog(data: {
    memberId: string;
    projectTitle: string;
    blogTitle: string;
    slug: string;
    description: string;
    projectDetails: string;
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
    images?: string[];
    tags?: string[];
    status?: BlogStatus;
  }): Promise<ProjectBlog> {
    const query = `
      INSERT INTO content.project_blogs (member_id, project_title, blog_title, slug, description, project_details, technologies, github_url, demo_url, images, tags, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, member_id as "memberId", project_title as "projectTitle", blog_title as "blogTitle",
                slug, description, project_details as "projectDetails", technologies,
                github_url as "githubUrl", demo_url as "demoUrl", images, tags, status,
                published_at as "publishedAt", created_at as "createdAt", updated_at as "updatedAt";
    `;
    const publishedAt = data.status === BlogStatus.PUBLISHED ? new Date() : null;
    const res = await pgPool.query(query, [
      data.memberId,
      data.projectTitle,
      data.blogTitle,
      data.slug,
      data.description,
      data.projectDetails,
      data.technologies || [],
      data.githubUrl || null,
      data.demoUrl || null,
      data.images || [],
      data.tags || [],
      data.status || BlogStatus.DRAFT,
      publishedAt,
    ]);
    return res.rows[0];
  }

  async deleteProjectBlog(id: string): Promise<void> {
    await pgPool.query('DELETE FROM content.project_blogs WHERE id = $1', [id]);
  }
}

export const blogRepository = new BlogRepository();

