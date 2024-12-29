import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

let clientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 5,     // מגביל את מספר החיבורים המקסימלי
    minPoolSize: 1,     // מספר מינימלי של חיבורים פתוחים
    socketTimeoutMS: 20000,
    waitQueueTimeoutMS: 5000
  });

  clientPromise = client.connect();
  global._mongoClientPromise = clientPromise;
}

export async function connectToDatabase() {
  try {
    const client = await global._mongoClientPromise;
    const db = client.db(MONGODB_DB);
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export async function closeConnection() {
  if (global._mongoClientPromise) {
    const client = await global._mongoClientPromise;
    await client.close();
    global._mongoClientPromise = null;
  }
}