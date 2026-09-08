import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';

export class ReportController {
  async getMemberReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pdfBuffer = await reportService.generateMemberReport(req.params.memberId);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="member-report-${req.params.memberId}.pdf"`);
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }

  async getClubReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pdfBuffer = await reportService.generateClubReport();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="codexclub-full-report.pdf"');
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();

