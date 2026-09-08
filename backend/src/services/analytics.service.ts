import { MemberModel } from '../models/member.model';
import { VolunteerModel } from '../models/volunteer.model';
import { SquadModel } from '../models/squad.model';
import { EventModel } from '../models/event.model';
import { ActivityModel } from '../models/activity.model';
import { pgPool } from '../config/postgres';

export class AnalyticsService {
  async getAdminStats() {
    const [
      totalMembers,
      activeMembers,
      totalVolunteers,
      activeVolunteers,
      totalSquads,
      totalEvents,
      recentActivities,
      creditDistribution,
      blogsCountRes,
    ] = await Promise.all([
      MemberModel.countDocuments(),
      MemberModel.countDocuments({ isActive: true }),
      VolunteerModel.countDocuments(),
      VolunteerModel.countDocuments({ isActive: true }),
      SquadModel.countDocuments({ isActive: true }),
      EventModel.countDocuments(),
      ActivityModel.find().sort({ createdAt: -1 }).limit(10).lean(),
      MemberModel.aggregate([
        {
          $group: {
            _id: '$creditScore',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      pgPool.query('SELECT COUNT(*) FROM content.blogs'),
    ]);

    // Average credit score
    const avgScoreAgg = await MemberModel.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$creditScore' } } },
    ]);
    const averageCreditScore = avgScoreAgg[0]?.avgScore ? Number(avgScoreAgg[0].avgScore.toFixed(1)) : 0;

    // Member growth over past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const growthAgg = await MemberModel.aggregate([
      { $match: { joinedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$joinedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const memberGrowth = growthAgg.map((g) => ({
      month: g._id,
      members: g.count,
    }));

    // Format credit score distribution for all 0-10 scores
    const distributionMap: Record<number, number> = {};
    for (let i = 0; i <= 10; i++) distributionMap[i] = 0;
    creditDistribution.forEach((d: any) => {
      distributionMap[d._id] = d.count;
    });

    const creditScoreChart = Object.entries(distributionMap).map(([score, count]) => ({
      score: `Score ${score}`,
      count,
    }));

    return {
      totalMembers,
      activeMembers,
      totalVolunteers,
      activeVolunteers,
      totalSquads,
      totalEvents,
      totalBlogs: parseInt(blogsCountRes.rows[0].count, 10),
      averageCreditScore,
      memberGrowth,
      creditScoreDistribution: creditScoreChart,
      recentActivities,
    };
  }

  async getVolunteerStats(volunteerAuthUserId: string) {
    const volunteer = await VolunteerModel.findOne({ authUserId: volunteerAuthUserId }).lean();
    if (!volunteer) return null;

    const assignedMembers = await MemberModel.find({ _id: { $in: volunteer.assignedMemberIds } }).lean();

    const avgScore =
      assignedMembers.length > 0
        ? Number((assignedMembers.reduce((acc, m) => acc + m.creditScore, 0) / assignedMembers.length).toFixed(1))
        : 0;

    const recentEvents = await EventModel.find({ status: { $in: ['UPCOMING', 'ONGOING'] } })
      .sort({ date: 1 })
      .limit(5)
      .lean();

    return {
      volunteer,
      assignedCount: assignedMembers.length,
      averageScore: avgScore,
      assignedMembers,
      recentEvents,
    };
  }

  async getMemberDashboardData(authUserId: string) {
    const member = await MemberModel.findOne({ authUserId })
      .populate('squadId', 'name description score leaderId memberIds')
      .lean();

    if (!member) return null;

    const [activities, upcomingEvents, blogsRes] = await Promise.all([
      ActivityModel.find({ memberId: member._id }).sort({ createdAt: -1 }).limit(10).lean(),
      EventModel.find({ status: 'UPCOMING' }).sort({ date: 1 }).limit(3).lean(),
      pgPool.query('SELECT * FROM content.project_blogs WHERE member_id = $1 ORDER BY created_at DESC LIMIT 5', [
        authUserId,
      ]),
    ]);

    return {
      profile: member,
      squad: member.squadId,
      activities,
      upcomingEvents,
      projectBlogs: blogsRes.rows,
    };
  }
}

export const analyticsService = new AnalyticsService();

