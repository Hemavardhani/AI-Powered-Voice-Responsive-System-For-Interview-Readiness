import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { feedback, qaHistory } = location.state || {};

  if (!feedback) {
    return <div>No feedback available</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Interview Complete! 🎉</h1>

        <div style={styles.feedbackBox}>
          <h2>Your Feedback</h2>
          <pre style={styles.feedbackText}>{feedback}</pre>
        </div>

        <div style={styles.qaSection}>
          <h3>Interview Transcript</h3>
          {qaHistory &&
            qaHistory.map((qa, index) => (
              <div key={index} style={styles.qaBlock}>
                <p style={styles.questionLabel}>
                  <strong>Q{index + 1}:</strong> {qa.question}
                </p>
                <p style={styles.answerLabel}>
                  <strong>A:</strong> {qa.answer}
                </p>
              </div>
            ))}
        </div>

        <div style={styles.buttons}>
          <button
            onClick={() => navigate("/dashboard")}
            style={styles.dashboardButton}
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/history")}
            style={styles.historyButton}
          >
            View All History
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "40px 20px",
  },
  card: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  feedbackBox: {
    backgroundColor: "#e8f5e9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
  },
  feedbackText: {
    whiteSpace: "pre-wrap",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  qaSection: {
    marginTop: "30px",
  },
  qaBlock: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  questionLabel: {
    color: "#1976d2",
    marginBottom: "8px",
  },
  answerLabel: {
    color: "#388e3c",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "30px",
  },
  dashboardButton: {
    flex: 1,
    padding: "15px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  historyButton: {
    flex: 1,
    padding: "15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Feedback;
