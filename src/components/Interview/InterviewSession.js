// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { doc, updateDoc, arrayUnion } from "firebase/firestore";
// import { auth, db } from "../../services/firebase";
// import { generateQuestion, generateFeedback } from "../../services/claudeAPI";
// import {
//   startSpeechRecognition,
//   speakText,
//   stopSpeaking,
// } from "../../services/speechService";

// function InterviewSession() {
//   const { roleId, level } = useParams();
//   const navigate = useNavigate();

//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [qaHistory, setQaHistory] = useState([]);
//   const [questionCount, setQuestionCount] = useState(0);
//   const [status, setStatus] = useState("Starting interview...");
//   const [userAnswer, setUserAnswer] = useState("");

//   const MAX_QUESTIONS = 7; // 2 HR + 5 technical

//   const roleNames = {
//     frontend: "Frontend Developer",
//     backend: "Backend Developer",
//     fullstack: "Full-Stack Developer",
//     java: "Java Developer",
//     datascience: "Data Scientist/ML Engineer",
//   };

//   // Move startInterview into useCallback to fix the warning
//   const startInterview = useCallback(async () => {
//     setStatus("Generating first question...");
//     const firstQuestion = await generateQuestion(roleNames[roleId], level, []);
//     setCurrentQuestion(firstQuestion);
//     setQuestionCount(1);

//     setStatus("AI is speaking...");
//     setIsSpeaking(true);
//     speakText(firstQuestion, () => {
//       setIsSpeaking(false);
//       setStatus('Your turn! Click "Start Speaking" to answer');
//     });
//   }, [roleId, level]);

//   // Start interview on component mount
//   useEffect(() => {
//     startInterview();
//     return () => stopSpeaking(); // Cleanup
//   }, [startInterview]);

//   const handleStartListening = () => {
//     setIsListening(true);
//     setStatus("Listening... Speak your answer");
//     setUserAnswer("");

//     startSpeechRecognition(
//       (transcript) => {
//         // Speech recognized successfully
//         setUserAnswer(transcript);
//         setIsListening(false);
//         handleAnswerSubmit(transcript);
//       },
//       (error) => {
//         // Error in speech recognition
//         console.error("Speech error:", error);
//         setIsListening(false);
//         setStatus("Error: Could not hear you. Try again.");
//       },
//     );
//   };

//   const endInterview = async (history) => {
//     setStatus("Generating your feedback...");

//     // Generate feedback
//     const feedback = await generateFeedback(roleNames[roleId], level, history);

//     // Save to Firestore
//     const user = auth.currentUser;
//     if (user) {
//       const interviewData = {
//         role: roleNames[roleId],
//         level: level,
//         date: new Date().toISOString(),
//         qaHistory: history,
//         feedback: feedback,
//       };

//       await updateDoc(doc(db, "users", user.uid), {
//         interviewHistory: arrayUnion(interviewData),
//       });
//     }

//     // Navigate to feedback page
//     navigate("/feedback", { state: { feedback, qaHistory: history } });
//   };

//   const handleAnswerSubmit = async (answer) => {
//     setStatus("Processing your answer...");

//     // Save Q&A pair
//     const newQA = {
//       question: currentQuestion,
//       answer: answer,
//     };
//     const updatedHistory = [...qaHistory, newQA];
//     setQaHistory(updatedHistory);

//     // Check if interview should end
//     if (questionCount >= MAX_QUESTIONS) {
//       endInterview(updatedHistory);
//       return;
//     }

//     // Generate next question
//     setStatus("Generating next question...");
//     const previousQuestions = updatedHistory.map((qa) => qa.question);
//     const nextQuestion = await generateQuestion(
//       roleNames[roleId],
//       level,
//       previousQuestions,
//     );
//     setCurrentQuestion(nextQuestion);
//     setQuestionCount(questionCount + 1);

//     // Speak next question
//     setStatus("AI is speaking...");
//     setIsSpeaking(true);
//     speakText(nextQuestion, () => {
//       setIsSpeaking(false);
//       setStatus('Your turn! Click "Start Speaking" to answer');
//     });
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <div style={styles.header}>
//           <h2>{roleNames[roleId]} Interview</h2>
//           <p>
//             Level: {level} | Question {questionCount}/{MAX_QUESTIONS}
//           </p>
//         </div>

//         <div style={styles.questionBox}>
//           <h3>Current Question:</h3>
//           <p style={styles.question}>{currentQuestion || "Loading..."}</p>
//         </div>

//         <div style={styles.statusBox}>
//           <p style={styles.status}>{status}</p>
//         </div>

//         {userAnswer && (
//           <div style={styles.answerBox}>
//             <strong>Your answer:</strong>
//             <p>{userAnswer}</p>
//           </div>
//         )}

//         <div style={styles.controls}>
//           <button
//             onClick={handleStartListening}
//             disabled={isListening || isSpeaking}
//             style={{
//               ...styles.micButton,
//               backgroundColor: isListening ? "#ff9800" : "#4CAF50",
//               opacity: isListening || isSpeaking ? 0.6 : 1,
//             }}
//           >
//             {isListening ? "🎤 Listening..." : "🎤 Start Speaking"}
//           </button>

//           {isListening && (
//             <p style={styles.hint}>Speak clearly and click stop when done</p>
//           )}
//         </div>

//         <button
//           onClick={() => {
//             if (window.confirm("Are you sure you want to end the interview?")) {
//               navigate("/dashboard");
//             }
//           }}
//           style={styles.endButton}
//         >
//           End Interview
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "100vh",
//     backgroundColor: "#f0f2f5",
//     padding: "20px",
//   },
//   card: {
//     backgroundColor: "white",
//     padding: "40px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     maxWidth: "800px",
//     width: "100%",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: "30px",
//     paddingBottom: "20px",
//     borderBottom: "2px solid #eee",
//   },
//   questionBox: {
//     backgroundColor: "#e3f2fd",
//     padding: "20px",
//     borderRadius: "8px",
//     marginBottom: "20px",
//   },
//   question: {
//     fontSize: "18px",
//     fontWeight: "500",
//     color: "#333",
//     marginTop: "10px",
//   },
//   statusBox: {
//     backgroundColor: "#fff3cd",
//     padding: "15px",
//     borderRadius: "5px",
//     marginBottom: "20px",
//     textAlign: "center",
//   },
//   status: {
//     margin: 0,
//     fontWeight: "500",
//   },
//   answerBox: {
//     backgroundColor: "#f1f8e9",
//     padding: "15px",
//     borderRadius: "5px",
//     marginBottom: "20px",
//   },
//   controls: {
//     textAlign: "center",
//     marginBottom: "20px",
//   },
//   micButton: {
//     padding: "15px 40px",
//     fontSize: "18px",
//     color: "white",
//     border: "none",
//     borderRadius: "50px",
//     cursor: "pointer",
//     transition: "all 0.3s",
//   },
//   hint: {
//     marginTop: "10px",
//     color: "#666",
//     fontSize: "14px",
//   },
//   endButton: {
//     width: "100%",
//     padding: "12px",
//     backgroundColor: "#f44336",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

// export default InterviewSession;

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import {
  generateQuestion,
  generateFeedback,
  shouldContinueInterview,
} from "../../services/claudeAPI";
import {
  startSpeechRecognition,
  speakText,
  stopSpeaking,
} from "../../services/speechService";

function InterviewSession() {
  const { roleId, level } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [qaHistory, setQaHistory] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [status, setStatus] = useState("Starting interview...");
  const [userAnswer, setUserAnswer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const roleNames = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    fullstack: "Full-Stack Developer",
    java: "Java Developer",
    datascience: "Data Scientist/ML Engineer",
  };

  const startInterview = useCallback(async () => {
    setStatus("Generating first question...");
    const previousQuestions = [];
    const firstQuestion = await generateQuestion(
      roleNames[roleId],
      level,
      previousQuestions,
    );
    setCurrentQuestion(firstQuestion);
    setQuestionCount(1);

    setStatus("AI is speaking...");
    setIsSpeaking(true);
    speakText(firstQuestion, () => {
      setIsSpeaking(false);
      setStatus('Your turn! Click "Start Speaking" to answer');
    });
  }, [roleId, level]);

  useEffect(() => {
    startInterview();
    return () => stopSpeaking();
  }, [startInterview]);

  const handleStartListening = () => {
    if (isListening || isSpeaking || isProcessing) return;

    setIsListening(true);
    setStatus("🎤 Listening... Speak your answer now");
    setUserAnswer("");

    startSpeechRecognition(
      (transcript) => {
        setUserAnswer(transcript);
        setIsListening(false);
        setStatus("Processing your answer...");
        handleAnswerSubmit(transcript);
      },
      (error) => {
        console.error("Speech error:", error);
        setIsListening(false);
        setStatus(
          '❌ Could not hear you clearly. Click "Start Speaking" to try again.',
        );
      },
    );
  };

  const handleAnswerSubmit = async (answer) => {
    if (!answer || answer.trim().length === 0) {
      setStatus("Please provide an answer before continuing.");
      return;
    }

    setIsProcessing(true);
    setStatus("💭 Processing your answer...");

    // Save Q&A pair
    const newQA = {
      question: currentQuestion,
      answer: answer,
    };
    const updatedHistory = [...qaHistory, newQA];
    setQaHistory(updatedHistory);

    // Check if interview should end
    const shouldContinue = shouldContinueInterview(updatedHistory);

    if (!shouldContinue || updatedHistory.length >= 10) {
      await endInterview(updatedHistory);
      return;
    }

    // Generate next question
    setStatus("🤔 Thinking of next question...");
    const previousQuestions = updatedHistory.map((qa) => qa.question);
    const nextQuestion = await generateQuestion(
      roleNames[roleId],
      level,
      previousQuestions,
    );

    setCurrentQuestion(nextQuestion);
    setQuestionCount(updatedHistory.length + 1);
    setUserAnswer(""); // Clear previous answer

    // Speak next question
    setStatus("AI is speaking...");
    setIsSpeaking(true);
    setIsProcessing(false);

    speakText(nextQuestion, () => {
      setIsSpeaking(false);
      setStatus('Your turn! Click "Start Speaking" to answer');
    });
  };

  const endInterview = async (history) => {
    setStatus("📝 Generating your detailed feedback...");
    setIsProcessing(true);

    try {
      // Generate feedback
      const feedback = await generateFeedback(
        roleNames[roleId],
        level,
        history,
      );

      // Save to Firestore
      const user = auth.currentUser;
      if (user) {
        const interviewData = {
          role: roleNames[roleId],
          level: level,
          date: new Date().toISOString(),
          timestamp: Date.now(),
          qaHistory: history,
          feedback: feedback,
          questionsAsked: history.length,
        };

        // Use setDoc with merge to avoid permission issues
        const userDocRef = doc(db, "users", user.uid);

        // First check if document exists
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          // Update existing document
          const existingData = docSnap.data();
          const existingHistory = existingData.interviewHistory || [];

          await setDoc(
            userDocRef,
            {
              interviewHistory: [...existingHistory, interviewData],
            },
            { merge: true },
          );
        } else {
          // Create new document
          await setDoc(userDocRef, {
            email: user.email,
            createdAt: new Date().toISOString(),
            interviewHistory: [interviewData],
          });
        }
      }

      // Navigate to feedback page
      navigate("/feedback", {
        state: {
          feedback,
          qaHistory: history,
          role: roleNames[roleId],
          level: level,
        },
      });
    } catch (error) {
      console.error("Error saving interview:", error);
      alert(
        "There was an error saving your interview. Please check your Firebase permissions.",
      );
      navigate("/dashboard");
    }
  };

  const handleManualEnd = () => {
    if (
      window.confirm(
        "Are you sure you want to end the interview now? You will receive feedback based on your current answers.",
      )
    ) {
      if (qaHistory.length === 0) {
        alert(
          "Please answer at least one question before ending the interview.",
        );
        return;
      }
      endInterview(qaHistory);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>{roleNames[roleId]} Interview</h2>
          <p>
            Level: {level} | Question {questionCount}/10
          </p>
        </div>

        <div style={styles.questionBox}>
          <h3>Current Question:</h3>
          <p style={styles.question}>{currentQuestion || "Loading..."}</p>
        </div>

        <div style={styles.statusBox}>
          <p style={styles.status}>{status}</p>
        </div>

        {userAnswer && (
          <div style={styles.answerBox}>
            <strong>✓ Your answer was recorded:</strong>
            <p>{userAnswer}</p>
          </div>
        )}

        <div style={styles.controls}>
          <button
            onClick={handleStartListening}
            disabled={isListening || isSpeaking || isProcessing}
            style={{
              ...styles.micButton,
              backgroundColor: isListening ? "#ff9800" : "#4CAF50",
              opacity: isListening || isSpeaking || isProcessing ? 0.6 : 1,
              cursor:
                isListening || isSpeaking || isProcessing
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isListening ? "🎤 Listening..." : "🎤 Start Speaking"}
          </button>

          {isListening && (
            <p style={styles.hint}>Speak clearly into your microphone...</p>
          )}

          {isSpeaking && (
            <p style={styles.hint}>AI is speaking... Please listen carefully</p>
          )}

          {isProcessing && <p style={styles.hint}>Processing... Please wait</p>}
        </div>

        <div style={styles.buttonRow}>
          <button
            onClick={handleManualEnd}
            disabled={isProcessing || qaHistory.length === 0}
            style={{
              ...styles.endButton,
              opacity: isProcessing || qaHistory.length === 0 ? 0.5 : 1,
            }}
          >
            End Interview Early
          </button>
        </div>

        <div style={styles.progressInfo}>
          <p>
            <strong>Answered:</strong> {qaHistory.length} questions
          </p>
          <p>
            <strong>Minimum required:</strong> 8 questions
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    width: "100%",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #eee",
  },
  questionBox: {
    backgroundColor: "#e3f2fd",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    minHeight: "100px",
  },
  question: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
    marginTop: "10px",
    lineHeight: "1.6",
  },
  statusBox: {
    backgroundColor: "#fff3cd",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
  },
  status: {
    margin: 0,
    fontWeight: "500",
    fontSize: "16px",
  },
  answerBox: {
    backgroundColor: "#d4edda",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "20px",
    border: "1px solid #c3e6cb",
  },
  controls: {
    textAlign: "center",
    marginBottom: "20px",
  },
  micButton: {
    padding: "20px 50px",
    fontSize: "20px",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  hint: {
    marginTop: "15px",
    color: "#666",
    fontSize: "14px",
    fontStyle: "italic",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  endButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  progressInfo: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "5px",
    fontSize: "14px",
  },
};

export default InterviewSession;
