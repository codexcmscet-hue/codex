export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  status: BlogStatus;
  category?: string;
  tags?: string[];
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectBlog {
  id: string;
  memberId: string;
  memberName?: string;
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
  status: BlogStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
