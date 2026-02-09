import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, Bot, User, RotateCcw } from 'lucide-react';
import voiceChatServiceRealtime from '../services/voiceChatServiceRealtime';
import underLine from '@/components/features/UnderLine';
import SpeedToggle from './speedToggle';

const AIVoiceChatComponentRealtime = ({ words, inflections, onPracticeCompleted }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [isRecording, setIsRecording] = useState(false);

  const currentAIMessageIdRef = useRef(null);
  const currentAITextRef = useRef('');

  const allWordsForUnderLine = [...(words || []), ...(inflections || [])];

  const handleSpeedChange = (speedValue) => {
    setSpeechSpeed(speedValue);
  };

  useEffect(() => {
    let shouldEndAfterAudio = false;

    voiceChatServiceRealtime.onAIResponseStart = () => {
      setIsSpeaking(true);
    };

    voiceChatServiceRealtime.onAIResponseEnd = () => {
      setIsSpeaking(false);
      currentAITextRef.current = '';
      currentAIMessageIdRef.current = null;
      
      if (voiceChatServiceRealtime.shouldEndChat()) {
        shouldEndAfterAudio = true;
      }
    };

    // ✅ נקרא כשהאודיו באמת נגמר
    voiceChatServiceRealtime.onAudioPlaybackEnded = () => {
      if (shouldEndAfterAudio) {
        shouldEndAfterAudio = false;
        
        setChatEnded(true);
        
        if (onPracticeCompleted) {
          onPracticeCompleted();
        }
      }
    };

    voiceChatServiceRealtime.onAITranscript = (text, isDone) => {
      if (isDone) {
        setConversationHistory(prev => {
          const updated = [...prev];
          const lastAIIndex = [...updated].reverse().findIndex(
            msg => msg.speaker === 'ai' && msg.status === 'speaking'
          );
          
          if (lastAIIndex >= 0) {
            const actualIndex = updated.length - 1 - lastAIIndex;
            updated[actualIndex] = {
              ...updated[actualIndex],
              text: text,
              status: 'completed'
            };
            return updated;
          }
          
          return [...prev, {
            id: Date.now(),
            speaker: 'ai',
            text: text,
            status: 'completed',
            timestamp: new Date()
          }];
        });
        
        currentAIMessageIdRef.current = null;
        currentAITextRef.current = '';
        
      } else {
        if (!currentAIMessageIdRef.current) {
          const messageId = Date.now();
          currentAIMessageIdRef.current = messageId;
          currentAITextRef.current = text;
          
          setConversationHistory(prev => [...prev, {
            id: messageId,
            speaker: 'ai',
            text: text,
            status: 'speaking',
            timestamp: new Date()
          }]);
        } else {
          currentAITextRef.current = currentAITextRef.current + text;
          
          setConversationHistory(prev => 
            prev.map(msg => 
              msg.id === currentAIMessageIdRef.current 
                ? {...msg, text: currentAITextRef.current}
                : msg
            )
          );
        }
      }
    };

    voiceChatServiceRealtime.onUserTranscript = (text) => {
      console.log('🎯 Received user transcript in component:', text);  // ✅ debug
      
      setConversationHistory(prev => {
        const lastUserIndex = [...prev].reverse().findIndex(
          msg => msg.speaker === 'user' && msg.status !== 'completed'
        );
        
        if (lastUserIndex >= 0) {
          const actualIndex = prev.length - 1 - lastUserIndex;
          const updated = [...prev];
          updated[actualIndex] = {
            ...updated[actualIndex],
            text: text,
            status: 'completed'
          };
          return updated;
        } else {
          return [...prev, {
            id: Date.now(),
            speaker: 'user',
            text: text,
            status: 'completed',
            timestamp: new Date()
          }];
        }
      });
    };

    voiceChatServiceRealtime.onError = (errorMessage) => {
      setError(errorMessage);
      setIsSpeaking(false);
      setIsRecording(false);
    };

    return () => {
      voiceChatServiceRealtime.cleanup();
    };
  }, [onPracticeCompleted]);

  const startChat = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      await voiceChatServiceRealtime.connect(words);
      
      console.log('✅ Connected successfully');

      setChatStarted(true);
      setChatEnded(false);
      setConversationHistory([]);
      setIsConnecting(false);

      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('📤 Requesting AI to start conversation...');

      voiceChatServiceRealtime.sendMessage({
        type: 'response.create'
      });

    } catch (error) {
      console.error('❌ Error starting chat:', error);
      setError('שגיאה: ' + error.message);
      setIsConnecting(false);
    }
  };

  const startUserTurn = () => {
    if (isSpeaking || chatEnded) return;
    
    console.log('🎤 User pressed button to start recording');
    setIsRecording(true);
    
    setConversationHistory(prev => [...prev, {
      id: Date.now(),
      speaker: 'user',
      text: '',
      status: 'recording',
      timestamp: new Date()
    }]);
    
    voiceChatServiceRealtime.startUserInput();
  };

  const endUserTurn = () => {
    if (!isRecording) return;
    
    console.log('🎤 User released button to end recording');
    setIsRecording(false);
    
    setConversationHistory(prev => {
      const updated = [...prev];
      const lastUserIndex = [...updated].reverse().findIndex(
        msg => msg.speaker === 'user' && msg.status === 'recording'
      );
      
      if (lastUserIndex >= 0) {
        const actualIndex = updated.length - 1 - lastUserIndex;
        updated[actualIndex] = {
          ...updated[actualIndex],
          status: 'processing'
        };
      }
      
      return updated;
    });
    
    voiceChatServiceRealtime.endUserInput();
  };

  const resetChat = async () => {
    voiceChatServiceRealtime.cleanup();
    setChatStarted(false);
    setChatEnded(false);
    setConversationHistory([]);
    setError(null);
    setIsSpeaking(false);
    setIsRecording(false);
    currentAITextRef.current = '';
    currentAIMessageIdRef.current = null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto my-12 px-4"
    >
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

      <motion.div 
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <p className="text-white text-xl font-medium text-center">
            {!chatStarted ? 'מוכן להתחיל שיחה קולית?' : 
             isConnecting ? 'מתחבר...' :
             chatEnded ? 'השיחה הסתיימה!' : 
             isSpeaking ? 'AI מדבר...' : 
             isRecording ? 'מקליט...' :
             'תורך - לחץ והחזק כדי לדבר'}
          </p>
        </div>

        <div className="p-8">
          {!chatStarted ? (
            <div className="flex flex-col items-center space-y-6">
              <motion.button
                onClick={startChat}
                disabled={isConnecting}
                whileHover={{ scale: isConnecting ? 1 : 1.05 }}
                whileTap={{ scale: isConnecting ? 1 : 0.95 }}
                className={`px-8 py-4 rounded-full font-medium flex items-center gap-3 shadow-lg transition-colors duration-300 ${
                  isConnecting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white`}
              >
                <MessageCircle className="w-5 h-5" />
                {isConnecting ? 'מתחבר...' : 'התחל שיחה קולית'}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <AnimatePresence>
                  {isSpeaking && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-3 p-4 bg-indigo-50 rounded-full"
                    >
                      <div className="p-2 rounded-full bg-indigo-100">
                        <Bot className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-indigo-800 font-medium">AI מדבר</span>
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
                  {isRecording && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-3 p-4 bg-purple-50 rounded-full"
                    >
                      <div className="p-2 rounded-full bg-purple-100">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-purple-800 font-medium">מקליט...</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 bg-red-500 rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-4">
                {chatEnded ? (
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
                  <motion.button
                    onMouseDown={startUserTurn}
                    onMouseUp={endUserTurn}
                    onTouchStart={startUserTurn}
                    onTouchEnd={endUserTurn}
                    disabled={isSpeaking || chatEnded}
                    whileHover={{ scale: (isSpeaking || chatEnded) ? 1 : 1.05 }}
                    whileTap={{ scale: (isSpeaking || chatEnded) ? 1 : 0.95 }}
                    className={`px-8 py-4 rounded-full font-medium flex items-center gap-3 shadow-lg transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white scale-110'
                        : isSpeaking || chatEnded
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    {isRecording ? 'מקליט... שחרר לשלוח' : 
                     isSpeaking ? 'ממתין ל-AI...' : 
                     'לחץ והחזק כדי לדבר'}
                  </motion.button>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700 text-center">היסטוריית השיחה</h3>
                <div className="max-h-96 overflow-y-auto space-y-2 p-4 bg-gray-50 rounded-xl">
                  <AnimatePresence>
                    {conversationHistory
                      .filter(msg => msg.status === 'completed' || msg.status === 'speaking' || msg.status === 'processing')
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
                            {(item.status === 'speaking' || item.status === 'processing') && (
                              <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 bg-current rounded-full"
                              />
                            )}
                          </div>
                          <div className={`text-sm text-gray-800 px-2 max-w-full break-words ${
                            item.speaker === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            {item.text ? (
                              underLine(item.text, allWordsForUnderLine)
                            ) : (
                              <span className="text-gray-400 italic">
                                {item.status === 'processing' ? 'מעבד...' : 'מדבר...'}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

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

        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">🎤 לחץ והחזק לפחות 2 שניות</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">🔇 שמור על סביבה שקטה</span>
            </div>
             <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">✨ שלב את המילים המאתגרות בשיחה</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">⏱️ קח את הזמן שלך - אין חופזה</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIVoiceChatComponentRealtime;