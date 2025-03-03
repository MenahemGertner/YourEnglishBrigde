'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // אופציונלי: שלח את השגיאה לשירות לוגים חיצוני
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="global-error-container">
          <h2>משהו השתבש!</h2>
          <button onClick={() => reset()}>נסה שוב</button>
        </div>
      </body>
    </html>
  );
}