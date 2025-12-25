// app/(routes)/(games)/prepositions/components/LivesDisplay.jsx

export default function LivesDisplay({ lives, maxLives }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">חיים:</span>
      <div className="flex gap-1">
        {Array.from({ length: maxLives }).map((_, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
              index < lives
                ? 'bg-red-500 text-white scale-100'
                : 'bg-gray-300 text-gray-500 scale-90'
            }`}
          >
            {index < lives ? '❤️' : '💔'}
          </div>
        ))}
      </div>
    </div>
  );
}