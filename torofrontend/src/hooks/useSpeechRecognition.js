import { useRef,useState,useEffect } from "react";

export default function useSpeechRecognition(onResultCallback) {
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
  
    useEffect(() => {
      const SpeechRecognition = 
        window.SpeechRecognition || window.webkitSpeechRecognition;
  
      if (!SpeechRecognition) {
        console.warn("SpeechRecognition not supported in this browser");
        return;
      }
  
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
  
      recognition.onresult = (e) => {
        let transcript = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
  
        if (onResultCallback) onResultCallback(transcript);
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
  



