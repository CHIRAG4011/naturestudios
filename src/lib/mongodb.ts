import { MongoClient, Db } from 'mongodb';

/**
 * MongoDB Atlas Connection Layer with Serverless Connection Pooling
 * Designed for Next.js App Router and Vercel serverless functions.
 */

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return !!process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb');
}

if (isMongoConfigured()) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri!, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri!, options);
    clientPromise = client.connect();
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!clientPromise) {
    if (!isMongoConfigured()) {
      return null;
    }
    client = new MongoClient(process.env.MONGODB_URI!, options);
    clientPromise = client.connect();
  }
  const connectedClient = await clientPromise;
  return connectedClient.db();
}

/**
 * Initialize all mandatory production indexes on MongoDB Atlas
 */
let indexesInitialized = false;

export async function ensureMongoIndexes(): Promise<void> {
  if (indexesInitialized) return;
  const db = await getMongoDb();
  if (!db) return;

  try {
    // 1. Users
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // 2. Accounts
    await db.collection('accounts').createIndex({ provider: 1, providerAccountId: 1 }, { unique: true });
    await db.collection('accounts').createIndex({ userId: 1 });

    // 3. Sessions
    await db.collection('sessions').createIndex({ sessionToken: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ userId: 1 });
    await db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // 4. Verification Codes
    await db.collection('verificationCodes').createIndex({ userId: 1 });
    await db.collection('verificationCodes').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // 5. Password Reset Tokens
    await db.collection('passwordResetTokens').createIndex({ tokenHash: 1 }, { unique: true });
    await db.collection('passwordResetTokens').createIndex({ userId: 1 });
    await db.collection('passwordResetTokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

    // 6. Projects & Requests
    await db.collection('projects').createIndex({ userId: 1 });
    await db.collection('projectRequests').createIndex({ userId: 1 });

    // 7. Messages & Notifications
    await db.collection('messages').createIndex({ projectId: 1 });
    await db.collection('messages').createIndex({ senderId: 1 });
    await db.collection('notifications').createIndex({ userId: 1 });

    // 8. Portfolios
    await db.collection('portfolios').createIndex({ slug: 1 }, { unique: true });
    await db.collection('portfolios').createIndex({ userId: 1 });
    await db.collection('portfolios').createIndex({ status: 1 });
    await db.collection('portfolios').createIndex({ portfolioSource: 1, category: 1, gfxSubcategory: 1, status: 1 });
    await db.collection('portfolios').createIndex({ portfolioSource: 1, status: 1, publishedAt: -1 });

    // 8b. Studio Portfolio Items
    await db.collection('studio_portfolio_items').createIndex({ portfolioSource: 1, type: 1, gfxCategory: 1, status: 1 });
    await db.collection('studio_portfolio_items').createIndex({ order: 1, createdAt: -1 });

    // 9. Portfolio Sub-collections
    await db.collection('portfolioProjects').createIndex({ portfolioId: 1 });
    await db.collection('portfolioSections').createIndex({ portfolioId: 1 });
    await db.collection('portfolioAssets').createIndex({ portfolioId: 1 });
    await db.collection('portfolioAssets').createIndex({ userId: 1 });
    await db.collection('portfolioDomains').createIndex({ hostname: 1 }, { unique: true });
    await db.collection('portfolioDomains').createIndex({ portfolioId: 1 });
    await db.collection('portfolioContacts').createIndex({ portfolioId: 1 });

    indexesInitialized = true;
  } catch (err) {
    console.error('Failed to initialize MongoDB indexes:', err);
  }
}

export default clientPromise;
