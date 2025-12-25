// app/(routes)/(games)/prepositions/components/Timer.jsx

import { formatTime, getTimePercentage } from '../hooks/useTimer';

export default function Timer({ timeRemaining, maxTime }) {
  const percentage = getTimePercentage(timeRemaining, maxTime);
  const formattedTime = formatTime(timeRemaining);

  // Color based on time remaining
  let barColor = 'bg-green-500';
  if (percentage < 30) {
    barColor = 'bg-red-500';
  } else if (percentage < 50) {
    barColor = 'bg-yellow-500';
  }

  return (
    <div className="w-full">
      {/* Time display */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">זמן נותר:</span>
        <span className={`text-2xl font-bold ${
          percentage < 30 ? 'text-red-600' : 'text-gray-800'
        }`}>
          {formattedTime}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}