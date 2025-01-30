'use client'
export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן יתווסף בהמשך הלוגיקה לשליחת הטופס
    console.log('Form submitted');
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">צור קשר</h1>
          
          <div className="text-center mb-8 leading-relaxed text-gray-700">
            <p className="font-semibold p-2">האתר בהרצה.</p>
              <p>
              אני אשמח לקבל שיתופים על חווית המשתמש שלך, 
              ועל היעילות והרלוונטיות של התוכן עבורך.<br/> 
              וכמובן שגם כל הערה, הארה, שאלה, פניה ונושאים אחרים יתקבלו בברכה.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-right text-gray-700">
                שם מלא
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-right text-gray-700">
                אימייל
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-right text-gray-700">
                נושא
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-right text-gray-700">
                תוכן ההודעה
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-900 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                שלח הודעה
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}