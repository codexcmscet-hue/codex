import { authRepository } from '../repositories/auth.repository';
import { MemberModel } from '../models/member.model';
import { VolunteerModel } from '../models/volunteer.model';
import { AdminModel } from '../models/admin.model';
import { SquadModel } from '../models/squad.model';
import { EventModel } from '../models/event.model';
import { ActivityModel } from '../models/activity.model';
import { CreditScoreHistoryModel } from '../models/creditScore.model';
import { blogRepository } from '../repositories/blog.repository';
import { hashPassword } from '../utils/password';
import { connectMongo, disconnectMongo } from '../config/database';
import { connectPostgres, pgPool } from '../config/postgres';
import { runMigrations } from '../database/migrate';
import { Role, EventStatus, BlogStatus } from '@codexclub/shared';
import { logger } from '../config/logger';

async function seed() {
  logger.info('Starting full database seed...');

  await connectMongo();
  await connectPostgres();
  await runMigrations();

  // Clear existing Mongo data
  await Promise.all([
    MemberModel.deleteMany({}),
    VolunteerModel.deleteMany({}),
    AdminModel.deleteMany({}),
    SquadModel.deleteMany({}),
    EventModel.deleteMany({}),
    ActivityModel.deleteMany({}),
    CreditScoreHistoryModel.deleteMany({}),
  ]);

  // Clear Postgres data
  await pgPool.query('TRUNCATE auth.users, auth.sessions, auth.password_resets, auth.email_verifications, content.blogs, content.project_blogs CASCADE');

  logger.info('Cleaned existing database records.');

  const passwordHash = await hashPassword('CodexClub@2026');

  // 1. Create Admin
  const adminUser = await authRepository.createUser({
    username: 'admin',
    email: 'admin@codexclub.org',
    passwordHash,
    role: Role.ADMIN,
    emailVerified: true,
  });

  await AdminModel.create({
    authUserId: adminUser.id,
    username: 'admin',
    email: 'admin@codexclub.org',
    displayName: 'Lead Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  logger.info('Created Admin account (admin / CodexClub@2026)');

  // 2. Create Volunteers
  const vol1User = await authRepository.createUser({
    username: 'sarah_tech',
    email: 'sarah@codexclub.org',
    passwordHash,
    role: Role.VOLUNTEER,
    emailVerified: true,
  });

  const vol1 = await VolunteerModel.create({
    authUserId: vol1User.id,
    username: 'sarah_tech',
    email: 'sarah@codexclub.org',
    displayName: 'Sarah Connor',
    department: 'Web & AI Department',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Lead mentor for full-stack web and competitive programming squads.',
  });

  const vol2User = await authRepository.createUser({
    username: 'alex_dev',
    email: 'alex@codexclub.org',
    passwordHash,
    role: Role.VOLUNTEER,
    emailVerified: true,
  });

  const vol2 = await VolunteerModel.create({
    authUserId: vol2User.id,
    username: 'alex_dev',
    email: 'alex@codexclub.org',
    displayName: 'Alex Mercer',
    department: 'Cybersecurity & Systems',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Systems engineer & hackathon coordinator.',
  });

  // 3. Create Members
  const memberData = [
    { username: 'dev_surya', email: 'surya@codex.edu', name: 'Surya Sharma', reg: '2024CS01', phone: '+919876543210', score: 9, github: 'https://github.com/surya' },
    { username: 'elena_ro', email: 'elena@codex.edu', name: 'Elena Rostova', reg: '2024CS02', phone: '+919876543211', score: 8, github: 'https://github.com/elena' },
    { username: 'marcus_k', email: 'marcus@codex.edu', name: 'Marcus Kim', reg: '2024CS03', phone: '+919876543212', score: 7, github: 'https://github.com/marcus' },
    { username: 'aaliyah_p', email: 'aaliyah@codex.edu', name: 'Aaliyah Patel', reg: '2024CS04', phone: '+919876543213', score: 9, github: 'https://github.com/aaliyah' },
    { username: 'jordan_lee', email: 'jordan@codex.edu', name: 'Jordan Lee', reg: '2024CS05', phone: '+919876543214', score: 6, github: 'https://github.com/jordan' },
    { username: 'zoe_chen', email: 'zoe@codex.edu', name: 'Zoe Chen', reg: '2024CS06', phone: '+919876543215', score: 10, github: 'https://github.com/zoe' },
  ];

  const createdMembers = [];
  for (const m of memberData) {
    const user = await authRepository.createUser({
      username: m.username,
      email: m.email,
      passwordHash,
      role: Role.MEMBER,
      emailVerified: true,
    });

    const member = await MemberModel.create({
      authUserId: user.id,
      username: m.username,
      email: m.email,
      phone: m.phone,
      registrationNumber: m.reg,
      displayName: m.name,
      creditScore: m.score,
      githubUrl: m.github,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${m.username}`,
      activitiesCompleted: Math.floor(Math.random() * 8) + 2,
      eventsParticipated: Math.floor(Math.random() * 4) + 1,
    });

    // Seed sample activities
    await ActivityModel.create({
      memberId: member._id,
      type: 'EVENT_PARTICIPATION',
      description: 'Completed Winter Hackathon 2026',
      points: 50,
    });

    await ActivityModel.create({
      memberId: member._id,
      type: 'PROJECT_SUBMISSION',
      description: 'Published open-source Next.js starter kit',
      points: 30,
    });

    // Seed credit history
    await CreditScoreHistoryModel.create({
      memberId: member._id,
      previousScore: 5,
      newScore: m.score,
      modifiedBy: vol1User.id,
      modifiedByRole: 'VOLUNTEER',
      modifiedByName: 'Sarah Connor',
      reason: 'Outstanding contribution in competitive programming workshops',
    });

    createdMembers.push(member);
  }

  // Assign members to volunteers
  vol1.assignedMemberIds = [createdMembers[0]._id, createdMembers[1]._id, createdMembers[2]._id] as any;
  await vol1.save();

  vol2.assignedMemberIds = [createdMembers[3]._id, createdMembers[4]._id, createdMembers[5]._id] as any;
  await vol2.save();

  // 4. Create Squads
  const squad1 = await SquadModel.create({
    name: 'Neural Knights',
    description: 'Specializing in generative AI, deep learning models, and autonomous agents.',
    leaderId: createdMembers[0]._id,
    memberIds: [createdMembers[1]._id, createdMembers[2]._id],
    project: 'Autonomous Code Reviewer with Multimodal LLMs',
    goal: 'Build and deploy a scalable code intelligence engine by Q3 2026',
    score: 850,
  });

  createdMembers[0].squadId = squad1._id as any;
  createdMembers[1].squadId = squad1._id as any;
  createdMembers[2].squadId = squad1._id as any;
  await Promise.all([createdMembers[0].save(), createdMembers[1].save(), createdMembers[2].save()]);

  const squad2 = await SquadModel.create({
    name: 'ZeroDay Protocol',
    description: 'Focused on offensive and defensive cybersecurity, CTF challenges, and kernel security.',
    leaderId: createdMembers[3]._id,
    memberIds: [createdMembers[4]._id, createdMembers[5]._id],
    project: 'WebAssembly-based Sandbox Vulnerability Scanner',
    goal: 'Compete in National Cyber Shield CTF Finals',
    score: 920,
  });

  createdMembers[3].squadId = squad2._id as any;
  createdMembers[4].squadId = squad2._id as any;
  createdMembers[5].squadId = squad2._id as any;
  await Promise.all([createdMembers[3].save(), createdMembers[4].save(), createdMembers[5].save()]);

  // 5. Create Events
  await EventModel.create({
    title: 'CodeSprint 2026: Algorithm Battle Royale',
    description: 'A 6-hour intense competitive programming contest featuring dynamic programming, graph theory, and system design challenges.',
    venue: 'Turing Computer Lab & Online Portal',
    organizer: 'CodeX Club Technical Board',
    date: '2026-10-15',
    startTime: '10:00',
    endTime: '16:00',
    registrationDeadline: '2026-10-14 23:59',
    status: EventStatus.UPCOMING,
    category: 'Competitive Programming',
    maxParticipants: 100,
    participantIds: [createdMembers[0]._id, createdMembers[1]._id, createdMembers[3]._id],
    createdBy: adminUser.id,
    images: [
      {
        key: 'events/codesprint.jpg',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        caption: 'Turing Hall Hackathon Space',
        uploadedAt: new Date(),
      },
    ],
  });

  await EventModel.create({
    title: 'Zero-Trust Architecture & Cloud Security Workshop',
    description: 'Hands-on workshop exploring OAuth2, mTLS, JWT security, container vulnerability scanning, and IAM privilege escalation defense.',
    venue: 'Auditorium Hall B',
    organizer: 'Cybersecurity Volunteer Wing',
    date: '2026-11-05',
    startTime: '14:00',
    endTime: '18:00',
    registrationDeadline: '2026-11-04 18:00',
    status: EventStatus.UPCOMING,
    category: 'Cybersecurity',
    maxParticipants: 80,
    participantIds: [createdMembers[2]._id, createdMembers[4]._id, createdMembers[5]._id],
    createdBy: vol2User.id,
    images: [
      {
        key: 'events/security.jpg',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        caption: 'Live demonstration setup',
        uploadedAt: new Date(),
      },
    ],
  });

  // 6. Create Blogs
  await blogRepository.createBlog({
    title: 'Mastering Full-Stack TypeScript Architecture in 2026',
    slug: 'mastering-fullstack-typescript-2026',
    content: `
      <h2>The Evolution of Modern Web Systems</h2>
      <p>Building resilient, enterprise-scale software requires clear architectural boundaries, type safety from database to UI, and defense-in-depth cybersecurity practices.</p>
      <h3>Key Pillars:</h3>
      <ul>
        <li><strong>Strict Schema Validation:</strong> Using single-source-of-truth Zod schemas across client and server.</li>
        <li><strong>Role-Based Access Control:</strong> Enforcing authorization at the API route boundary, never relying on UI hiding.</li>
        <li><strong>Stateless Resilience:</strong> Pairing JWT access tokens with rotating HttpOnly refresh tokens.</li>
      </ul>
    `,
    excerpt: 'Deep dive into architecting high-performance, secure web applications with Next.js, Express, and distributed databases.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    authorId: adminUser.id,
    authorName: 'Admin Team',
    authorRole: 'ADMIN',
    category: 'Architecture',
    tags: ['TypeScript', 'Architecture', 'Security', 'NodeJS'],
    status: BlogStatus.PUBLISHED,
    publishedAt: new Date(),
  });

  await blogRepository.createBlog({
    title: 'Deep Dive: Securing Authentication with Argon2id and Token Rotation',
    slug: 'securing-auth-argon2id-token-rotation',
    content: `
      <h2>Why Legacy Hashing Fails Against Modern GPU Clusters</h2>
      <p>Argon2id combines resistance against side-channel cache attacks with massive memory-hardness, defeating parallelized ASIC and GPU password-cracking hardware.</p>
      <p>Coupled with token rotation and account lockout rules, the system maintains high security even under sustained credential-stuffing attacks.</p>
    `,
    excerpt: 'An overview of cryptographic hashing algorithms, memory cost factors, and session invalidation strategies.',
    coverImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
    authorId: vol2User.id,
    authorName: 'Alex Mercer',
    authorRole: 'VOLUNTEER',
    category: 'Security',
    tags: ['Security', 'Cryptography', 'Auth'],
    status: BlogStatus.PUBLISHED,
    publishedAt: new Date(),
  });

  // 7. Create Member Project Blogs
  await blogRepository.createProjectBlog({
    memberId: createdMembers[0].authUserId,
    projectTitle: 'NeuralReviewer — Autonomous PR Analysis Bot',
    blogTitle: 'How We Built an AI Bot that Catches Security Vulnerabilities in GitHub PRs',
    slug: 'neuralreviewer-pr-analysis-bot',
    description: 'An autonomous GitHub application that scans pull requests for AST vulnerabilities, memory leaks, and style violations using specialized fine-tuned models.',
    projectDetails: `
      <h2>System Architecture</h2>
      <p>NeuralReviewer hooks into GitHub Webhooks, downloads the git diff, parses the AST using Tree-Sitter, and feeds contextual chunks to an LLM evaluator.</p>
      <h3>Technologies Used:</h3>
      <p>Built with Node.js, TypeScript, Docker, Tree-Sitter AST parser, and GitHub App Webhook API.</p>
    `,
    technologies: ['TypeScript', 'Node.js', 'GitHub API', 'Docker', 'Tree-Sitter'],
    githubUrl: 'https://github.com/surya/neural-reviewer',
    demoUrl: 'https://neural-reviewer.dev',
    tags: ['AI', 'DevOps', 'GitHub Actions'],
    status: BlogStatus.PUBLISHED,
  });

  logger.info('✅ Successfully seeded all databases with rich mock data!');
  logger.info('\n=============================================');
  logger.info('Default Test Credentials:');
  logger.info('Admin:     admin / CodexClub@2026');
  logger.info('Volunteer: sarah_tech / CodexClub@2026');
  logger.info('Member:    dev_surya / CodexClub@2026');
  logger.info('=============================================\n');

  await disconnectMongo();
  await pgPool.end();
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}

