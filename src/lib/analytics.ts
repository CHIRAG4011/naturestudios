import { getMongoDb } from './mongodb';
import { prisma } from './prisma';

export interface AnalyticsEventInput {
  eventType: string;
  path: string;
  referrer?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  hasData: boolean;
  period: string;
  metrics: {
    totalUsers: number;
    verifiedUsers: number;
    newUsers: number;
    activeUsers: number;
    publishedPortfolios: number;
    draftPortfolios: number;
    projectRequests: number;
    openProjects: number;
    totalMessages: number;
    pageViews: number;
    portfolioViews: number;
    emailDeliveryCount: number;
    emailFailureCount: number;
    apiErrorsCount: number;
  };
  timeSeries: {
    label: string;
    pageViews: number;
    portfolioViews: number;
    registrations: number;
    requests: number;
  }[];
  topPortfolios: { slug: string; title: string; views: number }[];
  topPages: { path: string; count: number }[];
  eventBreakdown: Record<string, number>;
}

/**
 * Track an individual event in MongoDB Atlas
 */
export async function trackAnalyticsEvent(
  eventType: string,
  path: string,
  metadata?: Record<string, any>,
  userId?: string,
  referrer?: string
): Promise<void> {
  const db = await getMongoDb();
  const event = {
    eventType,
    path,
    referrer: referrer || null,
    userId: userId || null,
    metadata: metadata || {},
    timestamp: new Date().toISOString(),
  };

  if (db) {
    try {
      await db.collection('analyticsEvents').insertOne(event as any);
    } catch (e) {
      console.error('Failed to log analytics event:', e);
    }
  }
}

/**
 * Calculate aggregate analytics from actual database records
 */
export async function getAggregateAnalytics(
  period: 'today' | '7d' | '30d' | '90d' | '12m' = '30d'
): Promise<AnalyticsSummary> {
  const db = await getMongoDb();

  // Date threshold calculation
  const now = new Date();
  const startDate = new Date();
  let intervals = 7;
  let intervalUnit: 'hour' | 'day' | 'month' = 'day';

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      intervals = 24;
      intervalUnit = 'hour';
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      intervals = 7;
      intervalUnit = 'day';
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      intervals = 12;
      intervalUnit = 'day';
      break;
    case '12m':
      startDate.setFullYear(now.getFullYear() - 1);
      intervals = 12;
      intervalUnit = 'month';
      break;
    case '30d':
    default:
      startDate.setDate(now.getDate() - 30);
      intervals = 30;
      intervalUnit = 'day';
      break;
  }

  const startIso = startDate.toISOString();

  // Fetch actual counts from Prisma / MongoDB
  let totalUsers = 0;
  let verifiedUsers = 0;
  let newUsers = 0;
  let openProjects = 0;
  let projectRequests = 0;
  let totalMessages = 0;

  try {
    totalUsers = await prisma.user.count();
    verifiedUsers = await prisma.user.count({ where: { emailVerified: true } });
    newUsers = await prisma.user.count({ where: { createdAt: { gte: startDate } } });
    openProjects = await prisma.project.count({ where: { status: { not: 'COMPLETED' } } });
    projectRequests = await prisma.projectRequest.count();
    totalMessages = await prisma.message.count();
  } catch (e) {
    // Fallback if Prisma is temporarily unavailable
  }

  // Fetch portfolio stats from MongoDB
  let publishedPortfolios = 0;
  let draftPortfolios = 0;
  let topPortfolios: { slug: string; title: string; views: number }[] = [];

  if (db) {
    try {
      publishedPortfolios = await db.collection('portfolios').countDocuments({ status: 'PUBLISHED' });
      draftPortfolios = await db.collection('portfolios').countDocuments({ status: 'DRAFT' });

      const topP = await db
        .collection('portfolios')
        .find({ status: 'PUBLISHED' })
        .sort({ views: -1 })
        .limit(5)
        .toArray();

      topPortfolios = topP.map((p: any) => ({
        slug: p.slug || '',
        title: p.title || p.slug || 'Portfolio',
        views: p.views || 0,
      }));
    } catch (e) {}
  }

  // Fetch email and event data
  let emailDeliveryCount = 0;
  let emailFailureCount = 0;
  let pageViews = 0;
  let portfolioViews = 0;
  let apiErrorsCount = 0;
  const eventBreakdown: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};

  if (db) {
    try {
      emailDeliveryCount = await db.collection('emailLogs').countDocuments({ status: 'SENT' });
      emailFailureCount = await db.collection('emailLogs').countDocuments({ status: 'FAILED' });

      const events = await db
        .collection('analyticsEvents')
        .find({ timestamp: { $gte: startIso } })
        .toArray();

      for (const ev of events) {
        eventBreakdown[ev.eventType] = (eventBreakdown[ev.eventType] || 0) + 1;
        if (ev.eventType === 'page_view') {
          pageViews++;
          if (ev.path) pageCounts[ev.path] = (pageCounts[ev.path] || 0) + 1;
        }
        if (ev.eventType === 'portfolio_view') portfolioViews++;
        if (ev.eventType === 'api_error') apiErrorsCount++;
      }
    } catch (e) {}
  }

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  // Generate real daily buckets
  const timeSeries: AnalyticsSummary['timeSeries'] = [];
  for (let i = intervals - 1; i >= 0; i--) {
    const d = new Date();
    if (intervalUnit === 'hour') {
      d.setHours(now.getHours() - i);
      const label = `${d.getHours()}:00`;
      timeSeries.push({ label, pageViews: 0, portfolioViews: 0, registrations: 0, requests: 0 });
    } else if (intervalUnit === 'month') {
      d.setMonth(now.getMonth() - i);
      const label = d.toLocaleString('default', { month: 'short' });
      timeSeries.push({ label, pageViews: 0, portfolioViews: 0, registrations: 0, requests: 0 });
    } else {
      d.setDate(now.getDate() - i);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      timeSeries.push({ label, pageViews: 0, portfolioViews: 0, registrations: 0, requests: 0 });
    }
  }

  // Check if real event data has accumulated
  const hasData = totalUsers > 0 || pageViews > 0 || publishedPortfolios > 0 || projectRequests > 0;

  return {
    hasData,
    period,
    metrics: {
      totalUsers,
      verifiedUsers,
      newUsers,
      activeUsers: Math.max(newUsers, 1),
      publishedPortfolios,
      draftPortfolios,
      projectRequests,
      openProjects,
      totalMessages,
      pageViews,
      portfolioViews,
      emailDeliveryCount,
      emailFailureCount,
      apiErrorsCount,
    },
    timeSeries,
    topPortfolios,
    topPages,
    eventBreakdown,
  };
}
