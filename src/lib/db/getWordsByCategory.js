import { connectToDatabase } from '@/lib/db/mongodb';

// מקבל category כ־'300', '600' וכו'
export async function getWordsByCategory(category = '300') {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(category);

    const items = await collection.find({}).toArray();

    // ניקוי ה־_id מג'אנק לצורך שימוש נקי בקליינט
    return items.map(({ _id, ...rest }) => ({
      ...rest,
      _id: _id.toString()
    }));
  } catch (error) {
    console.error('Error fetching words by category:', error);
    throw new Error('Failed to fetch words');
  }
}
