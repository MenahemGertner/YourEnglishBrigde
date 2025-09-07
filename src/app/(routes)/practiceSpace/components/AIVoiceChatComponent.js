import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, Square, Bot, User, RotateCcw } from 'lucide-react';
import voiceChatService from '../services/voiceChatService';
import underLine from '@/components/features/UnderLine';
import SpeedToggle from './speedToggle'

const AIVoiceChatComponent = ({ words, inflections, onPracticeCompleted }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('');
  const [error, setError] = useState(null);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  

// פונקציה לטיפול בשינוי מהירות
const handleSpeedChange = (speedValue) => {
  voiceChatService.setSpeechSpeed(speedValue);
};

  // מחשב מערך של כל המילים להדגשה
  const allWordsForUnderLine = [...(words || []), ...(inflections || [])];

  // ניקוי משאבים בעת סגירת הקומפוננטה
  useEffect(() => {
    return () => {
      voiceChatService.cleanup();
    };
  }, []);

  const startChat = async () => {
    setChatStarted(true);
    setChatEnded(false);
    setConversationHistory([]);
    setError(null);
    
    // AI מתחיל את השיחה עם הודעת פתיחה מותאמת למילים
    setTimeout(async () => {
      const openingMessage = await voiceChatService.generateOpeningMessage(words);
      await speakAIMessage(openingMessage);
    }, 1000);
  };

  const speakAIMessage = async (message) => {
    setIsSpeaking(true);
    setCurrentTurn('ai');
    
    const messageId = Date.now();
    const newMessage = {
      id: messageId,
      speaker: 'ai',
      text: message,
      status: 'speaking',
      timestamp: new Date()
    };
    
    setConversationHistory(prev => [...prev, newMessage]);
    
    try {
      await voiceChatService.playAIMessage(message);
      
    } catch (error) {
      console.error('Error playing AI message:', error);
      setError('שגיאה בנגינת הודעת AI');
    } finally {
      setIsSpeaking(false);
      
      // עדכון סטטוס ההודעה ל-completed
      setConversationHistory(prev => 
        prev.map(msg => msg.id === messageId ? {...msg, status: 'completed'} : msg)
      );
      
      // מעבר לתור המשתמש
      setCurrentTurn('user');
    }
  };

  const resetChat = () => {
    voiceChatService.cleanup();
    setConversationHistory([]);
    setChatStarted(false);
    setChatEnded(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setCurrentTurn('');
    setError(null);
  };

  const startListening = async () => {
    if (currentTurn !== 'user' || isListening || isProcessing) return;
    
    try {
      setError(null);
      setIsListening(true);
      
      const messageId = Date.now();
      const newMessage = {
        id: messageId,
        speaker: 'user',
        text: 'מקליט...',
        status: 'listening',
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, newMessage]);
      
      // התחלת הקלטה
      await voiceChatService.startRecording();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('שגיאה בהתחלת ההקלטה: ' + error.message);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    if (!isListening) return;
    
    try {
      setIsListening(false);
      setIsProcessing(true);
      
      // מציאת הודעת המשתמש הנוכחית
      const userMessage = [...conversationHistory].reverse().find(msg => 
        msg.speaker === 'user' && msg.status === 'listening'
      );

      if (userMessage) {
        // עדכון לסטטוס "מעבד"
        setConversationHistory(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? {...msg, text: 'מעבד...', status: 'processing'} 
              : msg
          )
        );
      }

      const result = await voiceChatService.processUserVoice(conversationHistory, words);
      
      if (result.success) {
        // עדכון הודעת המשתמש עם הטקסט שזוהה
        const updatedHistory = conversationHistory.map(msg => 
          msg.id === userMessage.id 
            ? {...msg, text: result.userText, status: 'completed'} 
            : msg
        );
        
        setConversationHistory(updatedHistory);
        setIsProcessing(false);
        
        // AI מגיב
        setTimeout(async () => {
          await speakAIMessage(result.aiResponse);
          
          // בדיקה האם השיחה צריכה להסתיים - אחרי שה-AI הגיב
          const shouldEndNow = voiceChatService.shouldEndChat(conversationHistory);
          
          if (shouldEndNow) {
            setTimeout(() => {
              setChatEnded(true);
              setCurrentTurn('');
              if (onPracticeCompleted) {
                onPracticeCompleted();
              }
            }, 1500);
          }
        }, 500);
        
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('Error processing voice interaction:', error);
      setError('שגיאה בעיבוד השיחה: ' + error.message);
      setIsListening(false);
      setIsProcessing(false);
      setCurrentTurn('user');
      
      // מחיקת ההודעה הזמנית במקרה של שגיאה
      setConversationHistory(prev => 
        prev.filter(msg => !(msg.status === 'listening' || msg.status === 'processing'))
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto my-12 px-4"
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4"
        >
          <MessageCircle className="w-6 h-6 text-indigo-600" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          שיחה קולית עם AI לשיפור השמיעה והדיבור
        </h1>
        
        <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
          נהל שיחה קולית באנגלית עם ה AI שלנו, ושפר את כישורי ההבנה והביטוי שלך.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-800 text-center font-medium">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline mx-auto block"
          >
            סגור
          </button>
        </motion.div>
      )}
      <SpeedToggle onSpeedChange={handleSpeedChange}/>

      {/* Main Content Card */}
      <motion.div 
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <p className="text-white text-xl font-medium text-center">
            {!chatStarted ? 'מוכן להתחיל שיחה קולית?' : 
             chatEnded ? 'השיחה הסתיימה!' : 
             isProcessing ? 'מעבד את דבריך...' :
             isSpeaking ? 'AI מדבר...' : 
             isListening ? 'מקשיב לך...' : 
             currentTurn === 'user' ? 'תורך לדבר' : 'מחכה...'}
          </p>
        </div>

        {/* Voice Chat Interface */}
        <div className="p-8">
          {!chatStarted ? (
            // Start Chat Button
            <div className="flex flex-col items-center space-y-6">
              <motion.button
                onClick={startChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-medium flex items-center gap-3 shadow-lg transition-colors duration-300 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <MessageCircle className="w-5 h-5" />
                התחל שיחה קולית
              </motion.button>
            </div>
          ) : (
            // Voice Chat Active
            <div className="space-y-8">
              {/* Conversation Status */}
              <div className="text-center">
                <AnimatePresence>
                  {(isSpeaking || isProcessing) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-3 p-4 bg-indigo-50 rounded-full"
                    >
                      <div className="p-2 rounded-full bg-indigo-100">
                        <Bot className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-indigo-800 font-medium">
                        {isProcessing ? 'מעבד' : 'AI מדבר'}
                      </span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scaleY: [1, 2, 1],
                              backgroundColor: ['#818CF8', '#6366F1', '#818CF8']
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.1
                            }}
                            className="w-1 h-4 bg-indigo-400 rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-3 p-4 bg-purple-50 rounded-full"
                    >
                      <div className="p-2 rounded-full bg-purple-100">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-purple-800 font-medium">מקשיב לך</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 bg-red-500 rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Voice Control Buttons */}
              <div className="flex justify-center gap-4">
                {chatEnded ? (
                  /* Reset Button - כשהשיחה הסתיימה */
                  <motion.button
                    onClick={resetChat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full font-medium flex items-center gap-3 shadow-lg transition-colors duration-300 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <RotateCcw className="w-5 h-5" />
                    שיחה חדשה
                  </motion.button>
                ) : (
                  /* Main Record Button - כשהשיחה פעילה */
                  <motion.button
                    onClick={isListening ? stopListening : startListening}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentTurn !== 'user' || isSpeaking || isProcessing}
                    className={`px-8 py-4 rounded-full font-medium flex items-center gap-3 shadow-lg transition-colors duration-300 ${
                      isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : currentTurn === 'user' && !isSpeaking && !isProcessing
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <Square className="w-5 h-5" />
                        עצור הקלטה
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        {currentTurn === 'user' && !isSpeaking && !isProcessing ? 'לחץ כדי לדבר' : 'ממתין...'}
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Conversation History */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700 text-center">היסטוריית השיחה</h3>
                <div className="max-h-48 overflow-y-auto space-y-2 p-4 bg-gray-50 rounded-xl">
                  <AnimatePresence>
                    {conversationHistory
                      .filter(msg => msg.status === 'completed' || msg.status === 'speaking' || msg.status === 'processing' || msg.status === 'listening')
                      .map((item) => (
                      <motion.div
                        key={item.id}
                        dir='ltr'
                        initial={{ opacity: 0, x: item.speaker === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: item.speaker === 'user' ? 20 : -20 }}
                        className={`flex ${item.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex flex-col gap-1 max-w-xs ${item.speaker === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                            item.speaker === 'ai' 
                              ? 'bg-indigo-100 text-indigo-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {item.speaker === 'ai' ? (
                              <Bot className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span className="font-medium">
                              {item.speaker === 'ai' ? 'AI' : 'אתה'}
                            </span>
                            {(item.status === 'speaking' || item.status === 'listening' || item.status === 'processing') && (
                              <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 bg-current rounded-full"
                              />
                            )}
                          </div>
                          <div className={`text-xs text-gray-600 px-2 max-w-full break-words ${
                            item.speaker === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            {/* השתמש בפונקציית underLine עבור כל הטקסטים פרט לטקסטי עיבוד */}
                            {item.text && 
                             (item.text !== 'מקליט...' && item.text !== 'מעבד...') ? (
                              underLine(item.text, allWordsForUnderLine)
                            ) : (
                              item.text
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Reset Button */}
              {chatEnded && (
                <div className="text-center mt-6">
                  <p className="text-lg font-medium text-gray-700 mb-4">
                     כל הכבוד! השיחה הושלמה בהצלחה 🎉
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">🎤 דבר בקצב רגוע ובטוח</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">🔇 שמור על סביבה שקטה</span>
            </div>
             <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">✨ שלב את המילים המאתגרות בשיחה</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">❓ בקש הסבר מה AI אם משהו לא ברור</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIVoiceChatComponent;