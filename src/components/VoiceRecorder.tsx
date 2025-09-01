import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onStatusChange: (status: 'ready' | 'listening' | 'processing' | 'speaking') => void;
  isDisabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscription,
  onStatusChange,
  isDisabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome or Safari.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      onStatusChange('listening');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      if (event.results[0].isFinal) {
        onTranscription(transcript);
        setIsRecording(false);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      onStatusChange('ready');
      
      toast({
        title: "Voice Recognition Error",
        description: "There was an error with voice recognition. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (recognitionRef.current) {
        onStatusChange('ready');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      onStatusChange('ready');
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center">
        <Button disabled variant="outline" className="w-16 h-16 rounded-full">
          <MicOff className="w-6 h-6" />
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Speech recognition not supported
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        variant={isRecording ? "destructive" : "default"}
        size="lg"
        className={`
          w-20 h-20 rounded-full border-2 transition-all duration-300
          ${isRecording 
            ? 'recording-pulse border-destructive/50 bg-destructive hover:bg-destructive/90' 
            : 'border-primary/30 bg-gradient-primary hover:shadow-glow'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isRecording ? (
          <MicOff className="w-8 h-8 text-destructive-foreground" />
        ) : (
          <Mic className="w-8 h-8 text-foreground" />
        )}
      </Button>
      
      <div className="mt-3">
        <p className="text-xs text-muted-foreground">
          {isRecording 
            ? 'Click to stop recording' 
            : isDisabled 
              ? 'Please wait...' 
              : 'Click to start speaking'
          }
        </p>
      </div>
    </div>
  );
};

export default VoiceRecorder;