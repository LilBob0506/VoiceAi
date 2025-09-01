import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

type VoiceStatus = 'ready' | 'listening' | 'processing' | 'speaking';

const VoiceChatbot = () => {
  const [status, setStatus] = useState<VoiceStatus>('ready');
  const [currentText, setCurrentText] = useState('');

  const handleTranscription = (text: string) => {
    setCurrentText(text);
    setStatus('processing');
    
    // Simulate AI processing and response
    setTimeout(() => {
      setStatus('speaking');
      setCurrentText("I'm your AI assistant. How can I help you today?");
      
      // Reset after "speaking"
      setTimeout(() => {
        setStatus('ready');
        setCurrentText('');
      }, 3000);
    }, 1500);
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'ready':
        return 'Ready to listen';
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      default:
        return 'Ready to listen';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return 'text-muted-foreground';
      case 'listening':
        return 'text-primary';
      case 'processing':
        return 'text-accent';
      case 'speaking':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-surface to-card">
      {/* AI Avatar */}
      <div className="mb-8 relative">
        <div className={`
          w-24 h-24 rounded-full glass-effect flex items-center justify-center
          ${status === 'listening' ? 'animate-pulse-glow' : ''}
          ${status === 'processing' ? 'animate-float' : ''}
          ${status === 'speaking' ? 'glow-effect' : ''}
        `}>
          <Bot className="w-12 h-12 text-primary" />
        </div>
        {status === 'listening' && (
          <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
        )}
      </div>

      {/* Welcome Message */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl font-bold gradient-text mb-4">
          AI Voice Assistant
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Hi! I'm your AI voice assistant. Press the microphone button below to start speaking with me.
        </p>
      </div>

      {/* Status Indicator */}
      <div className="mb-6 text-center">
        <div className={`text-sm font-medium mb-2 ${getStatusColor()}`}>
          {getStatusMessage()}
        </div>
        {currentText && (
          <div className="glass-effect rounded-lg px-4 py-2 max-w-md">
            <p className="text-foreground text-sm">
              {currentText}
            </p>
          </div>
        )}
      </div>

      {/* Voice Recorder */}
      <VoiceRecorder
        onTranscription={handleTranscription}
        onStatusChange={setStatus}
        isDisabled={status === 'processing' || status === 'speaking'}
      />

      {/* Visual Feedback for Voice States */}
      {status === 'listening' && (
        <div className="mt-6 flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-8 bg-primary rounded-full listening-wave"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceChatbot;