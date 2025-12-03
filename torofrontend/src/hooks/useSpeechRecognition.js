// import { useRef,useState,useEffect } from "react";

// export default function useSpeechRecognition(onResultCallback) {
//     const recognitionRef = useRef(null);
//     const [isListening, setIsListening] = useState(false);
  
//     useEffect(() => {
//       const SpeechRecognition = 
//         window.SpeechRecognition || window.webkitSpeechRecognition;
  
//       if (!SpeechRecognition) {
//         console.warn("SpeechRecognition not supported in this browser");
//         return;
//       }
  
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = "en-US";
  
//       recognition.onresult = (e) => {
//         let transcript = "";
//         for (let i = e.resultIndex; i < e.results.length; i++) {
//           transcript += e.results[i][0].transcript;
//         }
  
//         if (onResultCallback) onResultCallback(transcript);
//       };
  
//       recognition.onerror = console.error;
  
//       recognitionRef.current = recognition;
//     }, []);
  
//     const startListening = () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.start();
//         setIsListening(true);
//       }
//     };
  
//     const stopListening = () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//         setIsListening(false);
//       }
//     };
  
//     return { startListening, stopListening, isListening };
//   }
  
  // export const addTranscriptChunk = async (req, res) => {
  //   try {
  //     const { callId, speaker, text, language, startedAt, endedAt } = req.body;
  
  //     if (!callId || !speaker || !text) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "callId, speaker and text are required",
  //       });
  //     }
  
  //     await CallTranscript.create({
  //       callId,
  //       speaker,
  //       text,
  //       language,
  //       startedAt,
  //       endedAt,
  //     });
  
  //     res.json({ success: true });
  //   } catch (err) {
  //     console.error("Error saving transcript chunk:", err);
  //     res.status(500).json({ success: false, message: "Server error" });
  //   }
  // };

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



