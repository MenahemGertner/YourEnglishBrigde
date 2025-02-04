export default function NavigationMessage({ 
    navigationState, 
    onNextCategory 
  }) {
    if (!navigationState.showMessage) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-xl max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold mb-4 text-center">
            {navigationState.message}
          </h3>
          
          {navigationState.status === 'LIST_END' && navigationState.nextCategory && (
            <div className="text-center">
              <p className="mb-4">
                האם תרצה/י לעבור לרשימה הבאה?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={onNextCategory}
                  className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  כן, המשך לרשימה הבאה
                </button>
              </div>
            </div>
          )}
          
          {navigationState.status === 'COMPLETE' && (
            <p className="text-center text-green-600">
              כל הכבוד! סיימת את כל המילים והחזרות ברשימה הנוכחית.
            </p>
          )}
        </div>
      </div>
    );
  }