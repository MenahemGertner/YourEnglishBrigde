// app/(routes)/(games)/prepositions/components/ScoreDisplay.jsx

export default function ScoreDisplay({ score, completedSentences, totalSentences }) {
  return (
    <div className="flex items-center gap-6">
      {/* Score */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">ניקוד:</span>
        <span className="text-2xl font-bold text-blue-600">{score}</span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">התקדמות:</span>
        <span className="text-lg font-semibold text-gray-800">
          {completedSentences} / {totalSentences}
        </span>
      </div>
    </div>
  );
}