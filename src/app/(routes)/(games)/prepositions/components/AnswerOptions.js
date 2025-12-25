// app/(routes)/(games)/prepositions/components/AnswerOptions.jsx

export default function AnswerOptions({ options, onSelect, disabled = false }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className={`
            px-8 py-4 
            text-xl font-semibold 
            rounded-xl 
            transition-all duration-200
            ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}