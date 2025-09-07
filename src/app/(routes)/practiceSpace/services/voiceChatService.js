// services/voiceChatService.js

class VoiceChatService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.audioElement = null;
    this.speechSpeed = 1.0;
  }
  setSpeechSpeed(speed) {
  this.speechSpeed = speed;
}

  // פונקציה ליצירת הודעת פתיחה עם מילים מאתגרות
  async generateOpeningMessageWithWords(challengingWords) {
    try {
      const response = await fetch('/practiceSpace/api/AI-conversation/text-processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: '', // טקסט ריק כי זו הודעת פתיחה
          conversationContext: [], // אין היסטוריה עדיין
          challengingWords: challengingWords,
          stage: 'opening' // שלב פתיחה
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate opening message');
      }

      return data.processedText;
    } catch (error) {
      console.error('Opening Message Error:', error);
      throw error;
    }
  }

  // פונקציה לספירת הודעות שלמות - פונקציה מרכזית יחידה
  getCompletedMessages(conversationHistory) {
    return conversationHistory.filter(msg => {
      return msg.status === 'completed' && 
             msg.text && 
             msg.text.trim() !== '' &&
             !msg.text.includes('מקליט...') && 
             !msg.text.includes('מעבד...') &&
             msg.text !== 'מקליט...' &&
             msg.text !== 'מעבד...';
    });
  }

  // פונקציה לבדיקה האם השיחה צריכה להסתיים
  shouldEndChat(conversationHistory) {
    const completedMessages = this.getCompletedMessages(conversationHistory);
    return completedMessages.length >= 7; // AI פתח (1) + 4 זוגות (8) = 9
  }

  // פונקציה ליצירת הודעת פתיחה - עברה מהקומפוננטה
  async generateOpeningMessage(words) {
    try {
      if (!words || words.length === 0) {
        return "Hello! I'm excited to practice English with you. How are you doing today?";
      }

      const response = await this.generateOpeningMessageWithWords(words);
      return response;
    } catch (error) {
      console.error('Error generating opening message:', error);
      return "Hello! I'm excited to practice English with you. How are you doing today?";
    }
  }

  // בדיקת שלב השיחה - עברה מהקומפוננטה
  getChatStage(conversationHistory) {
    const completedMessages = this.getCompletedMessages(conversationHistory);
    const isLastUserTurn = completedMessages.length === 7;
    return isLastUserTurn ? 'closing' : 'middle';
  }

  // הקלטת אודיו - מתחיל הקלטה
  async startRecording() {
    try {
      if (this.isRecording) return false;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      return new Promise((resolve, reject) => {
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.onerror = (error) => {
          reject(error);
        };

        this.mediaRecorder.onstart = () => {
          this.isRecording = true;
          resolve(true);
        };

        this.mediaRecorder.start();
      });
    } catch (error) {
      console.error('Recording Error:', error);
      throw new Error('לא ניתן לגשת למיקרופון');
    }
  }

  // עצירת הקלטה ופלט audioBlob
  async stopRecordingAndGetBlob() {
    if (!this.mediaRecorder || !this.isRecording) return null;

    return new Promise((resolve) => {
      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        
        // יצירת Blob מהאודיו שהוקלט
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        
        // עצירת כל הרצועות
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // נגינת אודיו מטקסט - קורא ל-TTS וחוזר עם הפרומיס
  async playAIMessage(text) {
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
          speed: this.speechSpeed || 1.0
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
      await this.playAudio(audioUrl);
      
      // ניקוי URL אחרי השימוש
      URL.revokeObjectURL(audioUrl);

    } catch (error) {
      console.error('Play AI Message Error:', error);
      throw error;
    }
  }

  // נגינת אודיו מ-URL
  playAudio(audioUrl) {
    return new Promise((resolve, reject) => {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement = null;
      }

      this.audioElement = new Audio(audioUrl);
      
      this.audioElement.onended = () => {
        this.audioElement = null;
        resolve();
      };
      
      this.audioElement.onerror = (error) => {
        this.audioElement = null;
        reject(error);
      };
      
      this.audioElement.play().catch(reject);
    });
  }

  // עיבוד קול המשתמש - מבצע את כל התהליך
  async processUserVoice(conversationHistory, challengingWords = []) {
    try {
      // 1. עצירת ההקלטה וקבלת הBlob
      const audioBlob = await this.stopRecordingAndGetBlob();
      
      if (!audioBlob) {
        throw new Error('לא התקבל קובץ אודיו');
      }

      // 2. STT - המרת קול לטקסט
      const userText = await this.transcribeAudio(audioBlob);

      // 3. יצירת הקשר השיחה עם ההיסטוריה הקיימת
      const conversationContext = this.buildConversationContext(conversationHistory);

      // 4. בדיקה איזה שלב בשיחה
      const stage = this.getChatStage(conversationHistory);

      console.log('Processing user voice:', {
        userText,
        completedMessagesCount: this.getCompletedMessages(conversationHistory).length,
        stage
      });

      // 5. עיבוד הטקסט עם AI
      const aiResponse = await this.processTextWithContext(
        userText, 
        conversationContext, 
        challengingWords,
        stage
      );

      return {
        success: true,
        userText: userText,
        aiResponse: aiResponse
      };

    } catch (error) {
      console.error('Process User Voice Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // STT - המרת קול לטקסט
  async transcribeAudio(audioBlob) {
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
  }

  // בניית הקשר השיחה - רק ההיסטוריה השלמה
  buildConversationContext(conversationHistory) {
    // סינון הודעות: רק הודעות שהושלמו באמת
    const validMessages = this.getCompletedMessages(conversationHistory);

    // המרת ההודעות לפורמט של OpenAI
    const contextMessages = validMessages.map(msg => ({
      role: msg.speaker === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    console.log('Context messages (filtered):', contextMessages);

    return contextMessages;
  }

  // עיבוד טקסט עם הקשר
  async processTextWithContext(userText, conversationContext, challengingWords = [], stage = 'middle') {
    try {
      const response = await fetch('/practiceSpace/api/AI-conversation/text-processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userText,
          conversationContext: conversationContext,
          challengingWords: challengingWords,
          stage: stage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process text');
      }

      return data.processedText;
    } catch (error) {
      console.error('Text Processing Error:', error);
      throw new Error('שגיאה בעיבוד הטקסט: ' + error.message);
    }
  }

  // ניקוי משאבים
  cleanup() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    
    this.audioChunks = [];
    this.isRecording = false;
  }
}

// יצירת instance יחיד
const voiceChatService = new VoiceChatService();

export default voiceChatService;