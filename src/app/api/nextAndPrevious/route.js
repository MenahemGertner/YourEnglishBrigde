import { connectToDatabase } from '../../../app/utils/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index'));
    const currentCategory = searchParams.get('category');
    const direction = searchParams.get('direction');

    const { db } = await connectToDatabase();
    const currentCollection = db.collection(currentCategory);

    let adjacentWord = null;

    if (direction === 'next') {
      adjacentWord = await currentCollection.findOne(
        { index: { $gt: index } },
        { sort: { index: 1 } }
      );
    } else if (direction === 'prev') {
      adjacentWord = await currentCollection.findOne(
        { index: { $lt: index } },
        { sort: { index: -1 } }
      );
    }

    if (!adjacentWord) {
      return NextResponse.json(
        { error: 'No adjacent word found in current category' },
        { status: 404 }
      );
    }

    // הוסף את הקטגוריה הנוכחית לתוצאה
    adjacentWord.category = currentCategory;

    return NextResponse.json(adjacentWord);
  } catch (error) {
    console.error('Error finding adjacent word', error);
    return NextResponse.json(
      { error: 'Failed to find adjacent word', details: error.message },
      { status: 500 }
    );
  }
}