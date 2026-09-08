import PDFDocument from 'pdfkit';
import { MemberModel } from '../models/member.model';
import { VolunteerModel } from '../models/volunteer.model';
import { SquadModel } from '../models/squad.model';
import { EventModel } from '../models/event.model';
import { ActivityModel } from '../models/activity.model';
import { CreditScoreHistoryModel } from '../models/creditScore.model';
import { AppError } from '../middleware/errorHandler';

export class ReportService {
  async generateMemberReport(memberId: string): Promise<Buffer> {
    const member = await MemberModel.findById(memberId).populate('squadId', 'name score').lean();
    if (!member) throw new AppError('Member not found', 404);

    const [activities, creditHistory] = await Promise.all([
      ActivityModel.find({ memberId: member._id }).sort({ createdAt: -1 }).limit(10).lean(),
      CreditScoreHistoryModel.find({ memberId: member._id }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Header
      doc.fontSize(22).fillColor('#111827').text('CodeX Club — Member Performance Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#6b7280').text(`Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, { align: 'center' });
      doc.moveDown(1.5);

      // Member Profile Box
      doc.rect(40, doc.y, 515, 120).fillAndStroke('#f9fafb', '#e5e7eb');
      const startY = doc.y + 15;

      doc.fillColor('#111827').fontSize(14).text(member.displayName, 60, startY);
      doc.fontSize(10).fillColor('#4b5563');
      doc.text(`Username: @${member.username}`, 60, startY + 20);
      doc.text(`Email: ${member.email}`, 60, startY + 35);
      doc.text(`Registration No: ${member.registrationNumber}`, 60, startY + 50);
      doc.text(`Phone: ${member.phone}`, 60, startY + 65);

      doc.text(`Squad: ${(member.squadId as any)?.name || 'None'}`, 320, startY + 20);
      doc.text(`Credit Score: ${member.creditScore}/10`, 320, startY + 35);
      doc.text(`Events Participated: ${member.eventsParticipated}`, 320, startY + 50);
      doc.text(`Activities Completed: ${member.activitiesCompleted}`, 320, startY + 65);

      doc.y = startY + 130;
      doc.moveDown(1);

      // Section: Credit Score Audit History
      doc.fontSize(14).fillColor('#111827').text('Credit Score History');
      doc.moveDown(0.5);

      if (creditHistory.length === 0) {
        doc.fontSize(10).fillColor('#6b7280').text('No credit score modifications recorded.');
      } else {
        creditHistory.forEach((item: any) => {
          doc.fontSize(10).fillColor('#1f2937');
          doc.text(`• ${new Date(item.createdAt).toLocaleDateString()}: Score changed from ${item.previousScore} to ${item.newScore} by ${item.modifiedByName || item.modifiedByRole} (${item.reason})`);
        });
      }

      doc.moveDown(1.5);

      // Section: Recent Activities
      doc.fontSize(14).fillColor('#111827').text('Recent Activity Log');
      doc.moveDown(0.5);

      if (activities.length === 0) {
        doc.fontSize(10).fillColor('#6b7280').text('No activities recorded yet.');
      } else {
        activities.forEach((act: any) => {
          doc.fontSize(10).fillColor('#1f2937');
          doc.text(`• [${new Date(act.createdAt).toLocaleDateString()}] ${act.description} (+${act.points} pts)`);
        });
      }

      doc.moveDown(2);
      doc.fontSize(9).fillColor('#9ca3af').text('Confidential — CodeX Club Internal Report System', { align: 'center' });

      doc.end();
    });
  }

  async generateClubReport(): Promise<Buffer> {
    const [totalMembers, totalVolunteers, totalSquads, totalEvents, squads, events] = await Promise.all([
      MemberModel.countDocuments(),
      VolunteerModel.countDocuments(),
      SquadModel.countDocuments({ isActive: true }),
      EventModel.countDocuments(),
      SquadModel.find({ isActive: true }).sort({ score: -1 }).limit(5).lean(),
      EventModel.find().sort({ date: -1 }).limit(5).lean(),
    ]);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      doc.fontSize(22).fillColor('#111827').text('CodeX Club — Comprehensive Club Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#6b7280').text(`Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, { align: 'center' });
      doc.moveDown(1.5);

      // Metrics Grid
      doc.rect(40, doc.y, 515, 60).fillAndStroke('#f3f4f6', '#e5e7eb');
      const boxY = doc.y + 15;
      doc.fillColor('#111827').fontSize(12);
      doc.text(`Total Members: ${totalMembers}`, 60, boxY);
      doc.text(`Volunteers: ${totalVolunteers}`, 190, boxY);
      doc.text(`Active Squads: ${totalSquads}`, 320, boxY);
      doc.text(`Total Events: ${totalEvents}`, 440, boxY);

      doc.y = boxY + 70;

      // Top Squads
      doc.fontSize(14).fillColor('#111827').text('Top Performing Squads');
      doc.moveDown(0.5);
      squads.forEach((sq: any, i) => {
        doc.fontSize(10).fillColor('#374151');
        doc.text(`${i + 1}. ${sq.name} — Score: ${sq.score} pts (${sq.project || 'General Coding'})`);
      });

      doc.moveDown(1.5);

      // Recent Events
      doc.fontSize(14).fillColor('#111827').text('Recent & Upcoming Events');
      doc.moveDown(0.5);
      events.forEach((ev: any) => {
        doc.fontSize(10).fillColor('#374151');
        doc.text(`• ${ev.title} (${ev.date}) — Venue: ${ev.venue} | Status: ${ev.status}`);
      });

      doc.moveDown(2);
      doc.fontSize(9).fillColor('#9ca3af').text('Official CodeX Club Administrative Document', { align: 'center' });

      doc.end();
    });
  }
}

export const reportService = new ReportService();

