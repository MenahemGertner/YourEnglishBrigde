import Link from 'next/link';

const categories = [
  {
    title: "מבנה המשפט",
    items: [
      {
        title: "סדר המילים",
        link: "/rules/sentence-structure",
        description: "כללי היסוד של סדר המילים באנגלית: נושא-פועל-מושא (SVO), ומיקום תיאורים ומילות יחס במשפט."
      },
      {
        title: "חלקי הדיבור",
        link: "/partOfSpeech",
        description: "שמות עצם, פעלים, תואר, תואר הפועל, מילות יחס, ומילות חיבור - התפקיד והשימוש של כל אחד מהם."
      },
      {
        title: "משפטים מורכבים",
        link: "/rules/sentence-structure/complex-sentences",
        description: "חיבור פסוקיות עצמאיות ונלוות באמצעות מילות קישור כמו although, because, when."
      }
    ]
  },
  {
    title: "דקדוק",
    items: [
      {
        title: "זמנים",
        link: "/rules/grammar/tenses",
        description: "12 זמני הפועל באנגלית: עבר, הווה ועתיד בצורה פשוטה, ממושכת, מושלמת ומושלמת-ממושכת."
      },
      {
        title: "קול פעיל וסביל",
        link: "/rules/grammar/voice",
        description: "ההבדל בין 'הילד אכל את התפוח' (פעיל) ו'התפוח נאכל על-ידי הילד' (סביל) והשימוש בכל אחד מהם."
      },
      {
        title: "נטיות",
        link: "/rules/grammar/inflections",
        description: "שינויי צורת המילה: הוספת s לרבים, ed לעבר, ing להווה מתמשך, ודרגות השוואה של תארים."
      }
    ]
  },
  {
    title: "אוצר מילים",
    items: [
      {
        title: "שורשים ומבנה מילים",
        link: "/rules/vocabulary/word-formation",
        description: "תחיליות וסופיות נפוצות (un-, -tion, -ly) ואיך הן משנות את משמעות המילה ואת חלק הדיבור שלה."
      },
      {
        title: "ביטויים וניבים",
        link: "/rules/vocabulary/expressions",
        description: "ביטויים שכיחים כמו 'piece of cake' או 'break a leg' - משמעותם המטפורית והשימוש בהם."
      },
      {
        title: "אוצר מילים מקצועי",
        link: "/rules/vocabulary/professional",
        description: "מונחים ייחודיים בתחומים כמו עסקים, טכנולוגיה, רפואה ומשפטים, והשימוש הנכון בהם."
      }
    ]
  }
];

export default function RulesAndStructure() {
  return (
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        מבנה השפה האנגלית - כללים וחוקים
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <section key={category.title} className="bg-white shadow-lg rounded p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">{category.title}</h2>
            <div className="space-y-6">
              {category.items.map((item) => (
                <div key={item.title} className="space-y-3">
                  <Link
                    href={item.link}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}