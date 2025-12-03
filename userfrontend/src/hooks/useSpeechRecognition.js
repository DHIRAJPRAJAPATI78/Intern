import { useRef, useState, useEffect } from "react";

export default function useSpeechRecognition(onFinalCallback) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
      recognition.lang = "en-US";


    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript && onFinalCallback) {
        onFinalCallback(finalTranscript.trim());
      }
    };

      recognition.onerror = console.error;


    recognitionRef.current = recognition;
  }, []);




      const startListening = () => {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    };
  
    const stopListening = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };

  return { startListening, stopListening, isListening };
}



