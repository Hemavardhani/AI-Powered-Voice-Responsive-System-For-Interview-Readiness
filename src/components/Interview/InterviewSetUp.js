import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InterviewSetup() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState("beginner");

  const roleNames = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    fullstack: "Full-Stack Developer",
    java: "Java Developer",
    datascience: "Data Scientist/ML Engineer",
  };

  const handleStart = () => {
    navigate(`/interview/${roleId}/${level}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Interview Setup</h1>
        <h2>{roleNames[roleId]}</h2>

        <div style={styles.section}>
          <h3>Select Your Experience Level</h3>
          <div style={styles.levelOptions}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="beginner"
                checked={level === "beginner"}
                onChange={(e) => setLevel(e.target.value)}
              />
              Beginner (0-1 years)
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="intermediate"
                checked={level === "intermediate"}
                onChange={(e) => setLevel(e.target.value)}
              />
              Intermediate (1-3 years)
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="senior"
                checked={level === "senior"}
                onChange={(e) => setLevel(e.target.value)}
              />
              Senior (3+ years)
            </label>
          </div>
        </div>

        <div style={styles.info}>
          <h3>What to Expect:</h3>
          <ul>
            <li>HR questions to assess soft skills</li>
            <li>Technical questions based on your role</li>
            <li>Voice-only interaction (speak your answers)</li>
            <li>Detailed feedback at the end</li>
            <li>Interview duration: 10-15 minutes</li>
          </ul>
        </div>

        <button onClick={handleStart} style={styles.startButton}>
          Start Interview
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backButton}
        >
          Back
        </button>
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
    maxWidth: "600px",
    width: "100%",
  },
  section: {
    margin: "30px 0",
  },
  levelOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  radioLabel: {
    padding: "15px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  info: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  startButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "18px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  backButton: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#999",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default InterviewSetup;
