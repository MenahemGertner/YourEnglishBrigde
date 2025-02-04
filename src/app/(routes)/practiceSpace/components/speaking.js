import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Volume2, RefreshCw, PlayCircle, Waveform } from 'lucide-react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunksRef.current = [];
        setHasRecorded(true);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('שגיאה בגישה למיקרופון:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handlePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
          <Volume2 className="w-6 h-6 text-indigo-600" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          שיפור יכולות הדיבור
        </h1>
        
        <p className="text-md font-medium text-gray-600 max-w-2xl mx-auto">
          נסה לומר את המשפט הבא בשטף ללא עצירות!
        </p>
      </div>

      {/* Main Content Card */}
      <motion.div 
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Practice Sentence */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <p className="text-white text-xl font-medium text-center">
            The beautiful child glows with happiness where the water flows free.
          </p>
        </div>

        {/* Recording Interface */}
        <div className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Recording Animation */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center space-x-2"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Record Button */}
            <motion.button
              onClick={isRecording ? stopRecording : startRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-full font-medium flex items-center gap-3 shadow-lg transition-colors duration-300 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5" />
                  עצור הקלטה
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  {hasRecorded ? 'הקלט שוב' : 'התחל הקלטה'}
                </>
              )}
            </motion.button>

            {/* Audio Playback */}
            <AnimatePresence>
              {audioURL && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-md space-y-4"
                >
                  <div className="flex items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlayback}
                      className="p-3 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                    >
                      {isPlaying ? <Square className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                    </motion.button>
                    <p className="text-gray-600">האזן להקלטה שלך</p>
                  </div>
                  <audio ref={audioRef} src={audioURL} className="hidden" onEnded={() => setIsPlaying(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tips Section */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">🎯 התמקד בשטף הדיבור</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">🔄 חזור על המשפט מספר פעמים</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">👂 האזן להקלטה שלך ושפר</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AudioRecorder;