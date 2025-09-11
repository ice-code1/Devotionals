import { useState, useEffect, useRef } from 'react';

export function useTextToSpeech() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Try to find a good default voice (English, female if available)
        const preferredVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || availableVoices.find(voice => 
          voice.lang.startsWith('en')
        ) || availableVoices[0];
        
        setSelectedVoice(preferredVoice);
      };

      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const speak = (text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (isSupported && isPlaying) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (isSupported && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const toggle = (text: string) => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };

  return {
    isSupported,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    rate,
    pitch,
    speak,
    pause,
    resume,
    stop,
    toggle,
    setSelectedVoice,
    setRate,
    setPitch,
  };
}