// helpers.js - פונקציות עזר כלליות

// משתני אודיו גלובליים
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let audioElement = null;

// פונקציה לסינון הודעות שהושלמו באמת
export const getCompletedMessages = (conversationHistory) => {
  return conversationHistory.filter(msg => {
    return msg.status === 'completed' && 
           msg.text && 
           msg.text.trim() !== '' &&
           !msg.text.includes('מקליט...') && 
           !msg.text.includes('מעבד...') &&
           msg.text !== 'מקליט...' &&
           msg.text !== 'מעבד...';
  });
};

// התחלת הקלטת אודיו
export const startRecording = async () => {
  try {
    if (isRecording) return false;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onerror = (error) => {
        reject(error);
      };

      mediaRecorder.onstart = () => {
        isRecording = true;
        resolve(true);
      };

      mediaRecorder.start();
    });
  } catch (error) {
    console.error('Recording Error:', error);
    throw new Error('לא ניתן לגשת למיקרופון');
  }
};

// עצירת הקלטה וקבלת Blob
export const stopRecordingAndGetBlob = async () => {
  if (!mediaRecorder || !isRecording) return null;

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      isRecording = false;
      
      // יצירת Blob מהאודיו שהוקלט
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      
      // עצירת כל הרצועות
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      resolve(audioBlob);
    };

    mediaRecorder.stop();
  });
};

// נגינת אודיו מ-URL
export const playAudio = (audioUrl) => {
  return new Promise((resolve, reject) => {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }

    audioElement = new Audio(audioUrl);
    
    audioElement.onended = () => {
      audioElement = null;
      resolve();
    };
    
    audioElement.onerror = (error) => {
      audioElement = null;
      reject(error);
    };
    
    audioElement.play().catch(reject);
  });
};

// המרת אודיו לטקסט דרך STT API
export const transcribeAudio = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audioFile', audioBlob, 'recording.wav');
    formData.append('language', 'en');

    const response = await fetch('/practiceSpace/api/AI-conversation/stt', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to transcribe audio');
    }

    return data.transcription;
  } catch (error) {
    console.error('STT Error:', error);
    throw new Error('שגיאה בהמרת הקול לטקסט: ' + error.message);
  }
};

// המרה ונגינת טקסט לאודיו
export const playAIMessage = async (text) => {
  try {
    // קריאה ל-TTS API
    const response = await fetch('/practiceSpace/api/AI-conversation/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: 'alloy',
        model: 'tts-1',
        speed: 1.0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate speech');
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // נגינת האודיו
    await playAudio(audioUrl);
    
    // ניקוי URL אחרי השימוש
    URL.revokeObjectURL(audioUrl);

  } catch (error) {
    console.error('Play AI Message Error:', error);
    throw error;
  }
};

// בניית הקשר שיחה עבור API
export const buildConversationContext = (conversationHistory) => {
  // סינון הודעות: רק הודעות שהושלמו באמת
  const validMessages = getCompletedMessages(conversationHistory);

  // המרת ההודעות לפורמט של OpenAI
  const contextMessages = validMessages.map(msg => ({
    role: msg.speaker === 'ai' ? 'assistant' : 'user',
    content: msg.text
  }));

  console.log('Context messages (filtered):', contextMessages);

  return contextMessages;
};

// ניקוי משאבי אודיו והקלטה
export const cleanup = () => {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
  
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
  
  audioChunks = [];
  isRecording = false;
  mediaRecorder = null;
};

// פונקציות עזר נוספות

// בדיקה האם הקלטה פעילה
export const getIsRecording = () => isRecording;

// בדיקה האם אודיו מתנגן
export const getIsPlaying = () => audioElement !== null;

// עצירת נגינה ידנית
export const stopAudio = () => {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
};