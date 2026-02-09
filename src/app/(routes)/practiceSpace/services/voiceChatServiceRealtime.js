class VoiceChatServiceRealtime {
  constructor() {
    this.peerConnection = null;
    this.dataChannel = null;
    this.audioElement = null;
    this.mediaStream = null;
    this.isConnected = false;
    this.sessionId = null;
    this.aiMessageCount = 0;
    this.waitingForTranscription = false;
    this.pendingTranscript = null;  // ✅ נשמור את התמלול זמנית
    
    // Callbacks
    this.onAIResponseStart = null;
    this.onAIResponseEnd = null;
    this.onUserTranscript = null;
    this.onAITranscript = null;
    this.onError = null;
    this.onConnectionChange = null;
    this.onUserSpeechStart = null;
    this.onAudioPlaybackEnded = null;
    
    this.sessionReadyPromise = null;
    this._sessionReadyResolve = null;
  }

  async connect(challengingWords = []) {
    try {
      console.log('🔵 Starting WebRTC connection...');

      // ✅ אם כבר יש חיבור פעיל, נקה אותו קודם
      if (this.peerConnection || this.dataChannel) {
        console.log('⚠️ Cleaning up old connection before starting new one...');
        this.cleanup();
      }

      this.peerConnection = new RTCPeerConnection();

      this.audioElement = document.createElement('audio');
      this.audioElement.autoplay = true;
      this.peerConnection.ontrack = (e) => {
        console.log('🔊 Audio track received');
        this.audioElement.srcObject = e.streams[0];
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      this.peerConnection.addTrack(this.mediaStream.getTracks()[0]);

      this.dataChannel = this.peerConnection.createDataChannel('oai-events');

      this.sessionReadyPromise = new Promise((resolve) => {
        this._sessionReadyResolve = resolve;
      });

      const dataChannelPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Data channel timeout'));
        }, 15000);

        this.dataChannel.onopen = () => {
          console.log('✅ Data channel opened');
          clearTimeout(timeout);
          this.isConnected = true;
          if (this.onConnectionChange) this.onConnectionChange(true);
          resolve();
        };

        this.dataChannel.onmessage = (e) => this.handleMessage(e.data);

        this.dataChannel.onerror = (error) => {
          console.error('❌ Data channel error:', error);
          clearTimeout(timeout);
          reject(error);
        };

        this.dataChannel.onclose = () => {
          console.log('⚠️ Data channel closed');
          this.isConnected = false;
          if (this.onConnectionChange) this.onConnectionChange(false);
        };
      });

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      console.log('🔵 Exchanging SDP...');

      const sdpResponse = await fetch('/practiceSpace/api/AI-conversation/realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sdp: offer.sdp,
          challengingWords
        }),
      });

      if (!sdpResponse.ok) {
        const errorData = await sdpResponse.json();
        throw new Error(errorData.error || 'SDP exchange failed');
      }

      const answerSdp = await sdpResponse.text();
      console.log('✅ Received SDP answer');

      const answer = {
        type: 'answer',
        sdp: answerSdp,
      };
      
      // ✅ וודא ש-peerConnection עדיין קיים
      if (!this.peerConnection) {
        throw new Error('PeerConnection was closed during setup');
      }
      
      await this.peerConnection.setRemoteDescription(answer);

      await dataChannelPromise;
      await this.sessionReadyPromise;

      console.log('✅ Connection fully established');
      return true;

    } catch (error) {
      console.error('❌ Connection failed:', error);
      this.cleanup();
      throw error;
    }
  }

  handleMessage(message) {
    try {
      const data = JSON.parse(message);
      console.log('📨 Received:', data.type);

      switch (data.type) {
        case 'session.created':
          this.sessionId = data.session.id;
          console.log('✅ Session created:', this.sessionId);
          console.log('📋 Session config:', JSON.stringify(data.session, null, 2));
          
          if (this._sessionReadyResolve) {
            this._sessionReadyResolve();
          }
          break;

        case 'session.updated':
          console.log('✅ Session updated successfully');
          break;

        case 'response.created':
          console.log('✅ Response created');
          if (this.onAIResponseStart) this.onAIResponseStart();
          break;

        case 'response.output_audio_transcript.delta':
          if (data.delta && this.onAITranscript) {
            this.onAITranscript(data.delta, false);
          }
          break;

        case 'response.output_audio_transcript.done':
          if (data.transcript && this.onAITranscript) {
            this.onAITranscript(data.transcript, true);
            this.aiMessageCount++;
            console.log(`📊 AI Message count: ${this.aiMessageCount}/5`);
          }
          break;

        case 'response.done':
          console.log('✅ Response done');
          if (this.onAIResponseEnd) this.onAIResponseEnd();
          break;

        case 'output_audio_buffer.stopped':
          console.log('🔊 Audio playback finished');
          if (this.onAudioPlaybackEnded) this.onAudioPlaybackEnded();
          break;

        case 'input_audio_buffer.speech_started':
          console.log('🎤 User started speaking');
          if (this.onUserSpeechStart) this.onUserSpeechStart();
          break;

        case 'input_audio_buffer.speech_stopped':
          console.log('🎤 User stopped speaking');
          break;

        case 'input_audio_buffer.committed':
          console.log('✅ Audio buffer committed');
          break;

        case 'conversation.item.input_audio_transcription.completed':
          if (data.transcript) {
            console.log('📝 User transcript:', data.transcript);
            this.pendingTranscript = data.transcript;  // ✅ שמור את התמלול
            
            if (this.onUserTranscript) {
              this.onUserTranscript(data.transcript);
            }
          } else {
            console.warn('⚠️ Transcription completed but no transcript!', data);
          }
          
          // ✅ עכשיו הוסף את התמלול ל-conversation ואז בקש response
          if (this.waitingForTranscription && this.pendingTranscript) {
            this.waitingForTranscription = false;
            console.log('✅ Transcription done, adding to conversation...');
            
            setTimeout(() => {
              // הוסף את התמלול ל-conversation
              this.sendMessage({
                type: 'conversation.item.create',
                item: {
                  type: 'message',
                  role: 'user',
                  content: [
                    {
                      type: 'input_text',
                      text: this.pendingTranscript
                    }
                  ]
                }
              });
              
              // חכה רגע שה-item ייווצר ואז בקש response
              setTimeout(() => {
                console.log('📤 Now requesting AI response...');
                this.sendMessage({ type: 'response.create' });
                this.pendingTranscript = null;  // נקה את התמלול
              }, 150);
            }, 100);
          }
          break;

        case 'error':
          console.error('❌ API Error:', data.error);
          if (this.onError) this.onError(data.error.message);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('❌ Error handling message:', error);
    }
  }

  sendMessage(message) {
    if (this.dataChannel?.readyState === 'open') {
      console.log('📤 Sending:', message.type);
      this.dataChannel.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ Data channel not ready');
    }
  }

  startUserInput() {
    console.log('🎤 User started recording (audio flows automatically via WebRTC)');
  }

  endUserInput() {
    console.log('🎤 Ending user input, committing audio buffer...');
    
    // ✅ סמן שאנחנו מחכים לתמליל
    this.waitingForTranscription = true;
    
    // רק commit - response.create יבוא אחרי שנוסיף את התמלול ל-conversation!
    this.sendMessage({
      type: 'input_audio_buffer.commit'
    });
  }

  shouldEndChat() {
    return this.aiMessageCount >= 5;
  }

  cleanup() {
    console.log('🧹 Cleaning up...');
    
    // ✅ שמור את המצב לפני הניקוי
    const hadConnection = !!(this.peerConnection || this.dataChannel);
    
    if (!hadConnection) {
      console.log('⚠️ Already cleaned up');
      return;
    }
    
    try {
      if (this.dataChannel) {
        try {
          this.dataChannel.close();
        } catch (e) {
          console.warn('⚠️ Error closing data channel:', e);
        }
        this.dataChannel = null;
      }

      if (this.peerConnection) {
        try {
          this.peerConnection.close();
        } catch (e) {
          console.warn('⚠️ Error closing peer connection:', e);
        }
        this.peerConnection = null;
      }

      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (e) {
            console.warn('⚠️ Error stopping track:', e);
          }
        });
        this.mediaStream = null;
      }

      if (this.audioElement) {
        this.audioElement.srcObject = null;
        this.audioElement = null;
      }
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }

    this.isConnected = false;
    this.sessionId = null;
    this.aiMessageCount = 0;
    this.waitingForTranscription = false;
    this.pendingTranscript = null;
    
    console.log('✅ Cleanup completed');
  }
}

const voiceChatServiceRealtime = new VoiceChatServiceRealtime();
export default voiceChatServiceRealtime;