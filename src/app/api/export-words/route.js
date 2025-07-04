// src/app/api/export-words/route.js
import { getWordsByCategory } from '@/lib/db/getWordsByCategory';

const categories = ['300', '600', '900', '1200', '1500'];

export async function GET() {
  try {
    let output = '';
    
    for (const category of categories) {
      console.log(`מעבד קטגוריה ${category}...`);
      
      try {
        const data = await getWordsByCategory(category);
        
        if (!data || data.length === 0) {
          output += `// אין נתונים עבור קטגוריה ${category}\n`;
          continue;
        }

        // מיון לפי index כמו בקוד המקורי שלך
        const sortedData = [...data].sort((a, b) => a.index - b.index);
        const wordsArray = sortedData.map(item => `${item.index}: '${item.word}'`).join(', ');
        
        output += `\n// רשימת ${category} - ${sortedData.length} מילים\n`;
        output += `const words_${category} = [${wordsArray}];\n`;
        
      } catch (error) {
        console.error(`שגיאה בקטגוריה ${category}:`, error);
        output += `// שגיאה בטעינת קטגוריה ${category}: ${error.message}\n`;
      }
    }
    
    // החזרת התוצאה כטקסט עם הקידוד הנכון
    return new Response(output, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('שגיאה כללית:', error);
    return new Response('Failed to export words', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}