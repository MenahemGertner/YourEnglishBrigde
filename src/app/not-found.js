// app/not-found.js
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="my-12">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-purple-100 p-4">
        <div className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-lg mx-4 my-8 transform hover:scale-105 transition-transform duration-300">
          <div className="mb-8 text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            404
          </div>
          
          <h2 className="text-3xl font-bold text-gray-700 mb-6">
            אופס! נראה שהלכת לאיבוד 🤔
          </h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-xl text-gray-600">
              הדף שחיפשת החליט לצאת לחופשה... 🏖️
            </p>
            <p className="text-lg text-gray-500">
              או שאולי פשוט התבלבלת בדרך? 🗺️
            </p>
          </div>

          <div className="text-gray-500 italic mb-8">
            "לפעמים הדרכים הטובות ביותר מתחילות בטעות ניווט" 
            <br/>
            - מישהו חכם, כנראה 😉
          </div>
          
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:opacity-90 transform hover:-translate-y-1 transition-all duration-200"
          >
            קח אותי הביתה 🏠
          </Link>
        </div>
      </div>
    </div>
  )
}