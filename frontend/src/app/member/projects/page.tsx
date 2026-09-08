'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/layouts/GlassCard';
import { FileCode2, PlusCircle, ExternalLink, GitBranch, AlertCircle, Loader2 } from 'lucide-react';

export default function MemberProjectsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: '',
    blogTitle: '',
    description: '',
    projectDetails: '',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
    status: 'PUBLISHED',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: blogs, isPending } = useQuery({
    queryKey: ['myProjectBlogs'],
    queryFn: async () => {
      const res = await api.get('/blogs/projects');
      return res.data.data;
    },
  });

  const createProjectBlogMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      await api.post('/blogs/projects', {
        ...formData,
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProjectBlogs'] });
      setModalOpen(false);
      setFormData({
        projectTitle: '',
        blogTitle: '',
        description: '',
        projectDetails: '',
        technologies: '',
        githubUrl: '',
        demoUrl: '',
        status: 'PUBLISHED',
      });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to publish project blog');
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Project Showcase & Blogs</h1>
          <p className="text-sm text-zinc-400 mt-1">Publish architectural write-ups and showcase your GitHub repositories.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white text-black font-semibold rounded-xl text-xs hover:bg-zinc-200 transition-all shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Project Blog</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isPending ? (
          <div className="col-span-2 py-12 text-center text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <span>Loading published projects...</span>
          </div>
        ) : blogs?.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs">
            No project blogs published yet. Be the first to share your engineering project!
          </div>
        ) : (
          blogs?.map((blog: any) => (
            <GlassCard key={blog.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
                  <span>{blog.projectTitle}</span>
                  <span className="text-green-400">PUBLISHED</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{blog.blogTitle}</h3>
                <p className="text-xs text-zinc-300 line-clamp-3 mb-4">{blog.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {blog.technologies?.map((tech: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-zinc-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                <div className="flex items-center space-x-3">
                  {blog.githubUrl && (
                    <a
                      href={blog.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white flex items-center space-x-1"
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {blog.demoUrl && (
                    <a
                      href={blog.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
                <span className="text-zinc-500 text-[10px]">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-xl p-6 border-white/20 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Create Project Blog</h3>
            <p className="text-xs text-zinc-400 mb-6">Share your project design, architecture, and live links with the club.</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createProjectBlogMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">PROJECT NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    placeholder="e.g. Distributed Key-Value Store"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">BLOG TITLE</label>
                  <input
                    type="text"
                    required
                    value={formData.blogTitle}
                    onChange={(e) => setFormData({ ...formData, blogTitle: e.target.value })}
                    placeholder="e.g. How We Scaled to 100K QPS"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">SHORT DESCRIPTION</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of the project's purpose..."
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">TECHNICAL DETAILS & ARCHITECTURE (HTML/Markdown)</label>
                <textarea
                  rows={4}
                  required
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  placeholder="<p>Detailed architecture, algorithms used, and benchmarking results...</p>"
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">TECHNOLOGIES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="TypeScript, Rust, Docker, Redis"
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">GITHUB REPOSITORY URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">LIVE DEMO URL</label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.app"
                    className="w-full px-3 py-2 glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjectBlogMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                  {createProjectBlogMutation.isPending ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

