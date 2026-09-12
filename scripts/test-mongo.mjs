import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load .env manually if dotenv not installed
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;

console.log('='.repeat(60));
console.log('🔍 NATURESTUDIOS MONGODB CONNECTION DIAGNOSTIC TOOL');
console.log('='.repeat(60));

if (!uri || !uri.trim()) {
  console.log('\n❌ [ERROR] MONGODB_URI is empty or not set in your .env file!');
  console.log('👉 Open .env and set MONGODB_URI to your MongoDB Atlas connection string:');
  console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/naturestudios?retryWrites=true&w=majority\n');
  process.exit(1);
}

// Format check
if (uri.includes('<password>') || uri.includes('<username>')) {
  console.log('\n⚠️  [WARNING] Your MONGODB_URI still contains placeholders like <password> or <username>!');
  console.log('👉 Make sure you replace "<password>" with your real password without brackets < >.\n');
}

// Masked display
const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, (_, u) => `//${u}:****@`);
console.log(`\nTesting connection to:\n${masked}\n`);

async function run() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  const start = Date.now();
  try {
    console.log('⏳ Connecting to MongoDB Atlas cluster...');
    await client.connect();
    const duration = Date.now() - start;

    console.log(`✅ SUCCESS: Connected to MongoDB Atlas in ${duration}ms!`);
    
    const db = client.db();
    console.log(`📁 Connected Database: "${db.databaseName}"`);

    const ping = await db.command({ ping: 1 });
    console.log('📡 Ping response:', ping);

    const collections = await db.listCollections().toArray();
    console.log(`📊 Existing Collections (${collections.length}):`, collections.map(c => c.name).join(', ') || '(none yet)');
    
    console.log('\n🎉 Everything is configured properly! Your database is ready.');
  } catch (err) {
    const errorMsg = err.message || '';
    console.log('\n❌ [CONNECTION FAILED]');
    console.error(`Error details: ${errorMsg}\n`);

    console.log('💡 DIAGNOSIS & HOW TO FIX:');
    if (errorMsg.includes('bad auth') || errorMsg.includes('Authentication failed') || errorMsg.includes('auth failed')) {
      console.log('1. [AUTHENTICATION FAILED]:');
      console.log('   - The username or password in MONGODB_URI is incorrect.');
      console.log('   - Did you create a Database User in Atlas? (Security -> Database Access -> Add New Database User)');
      console.log('   - Atlas account email/password is NOT the same as Database User.');
      console.log('   - Did you remove the angle brackets "< >" around the password?');
      console.log('   - If your password has special characters like @, #, $, %, &, encode them:');
      console.log('     @ -> %40, # -> %23, % -> %25, etc.');
    } else if (errorMsg.includes('querySrv') || errorMsg.includes('ENOTFOUND') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ETIMEDOUT') || errorMsg.includes('Server selection timed out')) {
      console.log('1. [NETWORK ACCESS / IP NOT WHITELISTED]:');
      console.log('   - In MongoDB Atlas, go to "Security" -> "Network Access".');
      console.log('   - Click "+ Add IP Address".');
      console.log('   - Choose "Allow Access from Anywhere" (0.0.0.0/0) and click Confirm.');
      console.log('   - Wait 1-2 minutes for Atlas to deploy the network change.');
      console.log('2. [DNS / ISP BLOCKING SRV]:');
      console.log('   - If your local ISP or router blocks DNS SRV queries (mongodb+srv://),');
      console.log('     change your DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare).');
    } else if (errorMsg.includes('URI malformed') || errorMsg.includes('Invalid connection string')) {
      console.log('1. [INVALID URI FORMAT]:');
      console.log('   - The connection string contains illegal unencoded characters (like "@" in the password).');
      console.log('   - Encode the password or use an alphanumeric password (A-Z, a-z, 0-9).');
    } else {
      console.log('1. Check that the cluster is not paused in MongoDB Atlas.');
      console.log('2. Verify the connection string copied from Atlas: Connect -> Drivers -> Node.js.');
    }
  } finally {
    await client.close().catch(() => {});
  }
}

run();
