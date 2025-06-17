import { connectToDatabase } from '@/lib/db/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '300';

    const { db } = await connectToDatabase();
    const collection = db.collection(category);

    const items = await collection.find({}).toArray();

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error connecting to database', error);
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error.message },
      { status: 500 }
    );
  }
}