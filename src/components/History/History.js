// import React, { useState, useEffect } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../services/firebase";
// import { useNavigate } from "react-router-dom";

// function History() {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc.exists()) {
//         const data = userDoc.data();
//         setHistory(data.interviewHistory || []);
//       }
//     }
//     setLoading(false);
//   };

//   if (loading) {
//     return <div style={styles.container}>Loading...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1>Interview History</h1>
//         <button
//           onClick={() => navigate("/dashboard")}
//           style={styles.backButton}
//         >
//           Back to Dashboard
//         </button>
//       </div>

//       {history.length === 0 ? (
//         <div style={styles.emptyState}>
//           <p>No interview history yet. Start your first interview!</p>
//           <button
//             onClick={() => navigate("/dashboard")}
//             style={styles.startButton}
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       ) : (
//         <div style={styles.historyList}>
//           {history.map((interview, index) => (
//             <div key={index} style={styles.historyCard}>
//               <div style={styles.cardHeader}>
//                 <h3>{interview.role}</h3>
//                 <span style={styles.badge}>{interview.level}</span>
//               </div>
//               <p style={styles.date}>
//                 {new Date(interview.date).toLocaleDateString()} at{" "}
//                 {new Date(interview.date).toLocaleTimeString()}
//               </p>
//               <details style={styles.details}>
//                 <summary style={styles.summary}>View Feedback</summary>
//                 <pre style={styles.feedbackText}>{interview.feedback}</pre>
//               </details>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f0f2f5",
//     padding: "40px 20px",
//   },
//   header: {
//     maxWidth: "1000px",
//     margin: "0 auto 30px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backButton: {
//     padding: "10px 20px",
//     backgroundColor: "#2196F3",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   emptyState: {
//     maxWidth: "600px",
//     margin: "100px auto",
//     textAlign: "center",
//     backgroundColor: "white",
//     padding: "60px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   },
//   startButton: {
//     marginTop: "20px",
//     padding: "15px 30px",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "16px",
//   },
//   historyList: {
//     maxWidth: "1000px",
//     margin: "0 auto",
//     display: "grid",
//     gap: "20px",
//   },
//   historyCard: {
//     backgroundColor: "white",
//     padding: "25px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   },
//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "10px",
//   },
//   badge: {
//     padding: "5px 15px",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "bold",
//   },
//   date: {
//     color: "#666",
//     fontSize: "14px",
//     marginBottom: "15px",
//   },
//   details: {
//     marginTop: "15px",
//   },
//   summary: {
//     cursor: "pointer",
//     fontWeight: "bold",
//     color: "#2196F3",
//     padding: "10px 0",
//   },
//   feedbackText: {
//     backgroundColor: "#f9f9f9",
//     padding: "15px",
//     borderRadius: "5px",
//     marginTop: "10px",
//     whiteSpace: "pre-wrap",
//     fontSize: "14px",
//     lineHeight: "1.6",
//   },
// };

// export default History;

import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const interviewHistory = data.interviewHistory || [];

        // Sort by date (newest first)
        const sortedHistory = interviewHistory.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setHistory(sortedHistory);
      } else {
        // Document doesn't exist yet
        setHistory([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(
        "Unable to load interview history. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <h2>Loading your interview history...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            style={styles.backButton}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📚 Interview History</h1>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </div>

      {history.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <h2>No Interview History Yet</h2>
          <p>Complete your first mock interview to see it here!</p>
          <button
            onClick={() => navigate("/dashboard")}
            style={styles.startButton}
          >
            Start Your First Interview
          </button>
        </div>
      ) : (
        <div style={styles.historyList}>
          <div style={styles.statsBox}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{history.length}</div>
              <div style={styles.statLabel}>Total Interviews</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>
                {history.reduce((sum, i) => sum + (i.questionsAsked || 0), 0)}
              </div>
              <div style={styles.statLabel}>Questions Answered</div>
            </div>
          </div>

          {history.map((interview, index) => (
            <div key={index} style={styles.historyCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.cardTitle}>{interview.role}</h3>
                  <div style={styles.cardMeta}>
                    <span style={styles.badge}>{interview.level}</span>
                    <span style={styles.questionCount}>
                      {interview.questionsAsked ||
                        interview.qaHistory?.length ||
                        0}{" "}
                      questions
                    </span>
                  </div>
                </div>
                <div style={styles.dateBox}>
                  {new Date(interview.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <div style={styles.time}>
                    {new Date(interview.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <details style={styles.details}>
                <summary style={styles.summary}>
                  📊 View Feedback & Transcript
                </summary>

                <div style={styles.feedbackSection}>
                  <h4 style={styles.sectionTitle}>Feedback:</h4>
                  <pre style={styles.feedbackText}>{interview.feedback}</pre>
                </div>

                {interview.qaHistory && interview.qaHistory.length > 0 && (
                  <div style={styles.transcriptSection}>
                    <h4 style={styles.sectionTitle}>Interview Transcript:</h4>
                    {interview.qaHistory.map((qa, idx) => (
                      <div key={idx} style={styles.qaBlock}>
                        <p style={styles.questionText}>
                          <strong>Q{idx + 1}:</strong> {qa.question}
                        </p>
                        <p style={styles.answerText}>
                          <strong>A:</strong>{" "}
                          {qa.answer || "No answer recorded"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "40px 20px",
  },
  header: {
    maxWidth: "1000px",
    margin: "0 auto 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  loadingBox: {
    maxWidth: "600px",
    margin: "100px auto",
    textAlign: "center",
    backgroundColor: "white",
    padding: "60px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  errorBox: {
    maxWidth: "600px",
    margin: "100px auto",
    textAlign: "center",
    backgroundColor: "#ffebee",
    padding: "60px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    color: "#d32f2f",
  },
  emptyState: {
    maxWidth: "600px",
    margin: "100px auto",
    textAlign: "center",
    backgroundColor: "white",
    padding: "60px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  startButton: {
    marginTop: "20px",
    padding: "15px 30px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  statsBox: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    justifyContent: "center",
  },
  statItem: {
    backgroundColor: "white",
    padding: "20px 40px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2196F3",
  },
  statLabel: {
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  historyList: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gap: "20px",
  },
  historyCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "15px",
  },
  cardTitle: {
    margin: "0 0 10px 0",
    color: "#333",
    fontSize: "20px",
  },
  cardMeta: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  badge: {
    padding: "5px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  questionCount: {
    fontSize: "14px",
    color: "#666",
  },
  dateBox: {
    textAlign: "right",
    color: "#666",
    fontSize: "14px",
  },
  time: {
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
  },
  details: {
    marginTop: "15px",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "bold",
    color: "#2196F3",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "5px",
    userSelect: "none",
  },
  feedbackSection: {
    marginTop: "20px",
  },
  transcriptSection: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  sectionTitle: {
    marginBottom: "15px",
    color: "#333",
  },
  feedbackText: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "5px",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: "1.6",
    border: "1px solid #e0e0e0",
  },
  qaBlock: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  questionText: {
    color: "#1976d2",
    marginBottom: "10px",
    lineHeight: "1.5",
  },
  answerText: {
    color: "#388e3c",
    lineHeight: "1.5",
  },
};

export default History;
