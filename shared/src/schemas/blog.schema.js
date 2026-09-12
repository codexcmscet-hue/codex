"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectBlogSchema = exports.CreateProjectBlogSchema = exports.UpdateBlogSchema = exports.CreateBlogSchema = void 0;
const zod_1 = require("zod");
const blog_types_1 = require("../types/blog.types");
exports.CreateBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(200).trim(),
    content: zod_1.z.string().min(20, 'Content must be at least 20 characters'),
    excerpt: zod_1.z.string().max(300).trim().optional(),
    coverImageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    category: zod_1.z.string().max(50).trim().optional(),
    tags: zod_1.z.array(zod_1.z.string().trim()).max(10).optional().default([]),
    status: zod_1.z.nativeEnum(blog_types_1.BlogStatus).optional().default(blog_types_1.BlogStatus.DRAFT),
});
exports.UpdateBlogSchema = exports.CreateBlogSchema.partial();
exports.CreateProjectBlogSchema = zod_1.z.object({
    projectTitle: zod_1.z.string().min(2).max(200).trim(),
    blogTitle: zod_1.z.string().min(3).max(200).trim(),
    description: zod_1.z.string().min(10).max(1000).trim(),
    projectDetails: zod_1.z.string().min(20),
    technologies: zod_1.z.array(zod_1.z.string().trim()).min(1, 'Select at least one technology'),
    githubUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    demoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    images: zod_1.z.array(zod_1.z.string().url()).max(5).optional().default([]),
    tags: zod_1.z.array(zod_1.z.string().trim()).max(10).optional().default([]),
    status: zod_1.z.nativeEnum(blog_types_1.BlogStatus).optional().default(blog_types_1.BlogStatus.DRAFT),
});
exports.UpdateProjectBlogSchema = exports.CreateProjectBlogSchema.partial();
//# sourceMappingURL=blog.schema.js.map