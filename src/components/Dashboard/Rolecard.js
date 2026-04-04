import React from "react";

function RoleCard({ role, onSelect }) {
  return (
    <div
      style={styles.card}
      onClick={() => onSelect(role.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      }}
    >
      <div style={styles.icon}>{role.icon}</div>
      <h3 style={styles.title}>{role.name}</h3>
      <p style={styles.description}>{role.description}</p>
      <button style={styles.button}>Start Interview →</button>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  icon: {
    fontSize: "48px",
    marginBottom: "15px",
  },
  title: {
    margin: "10px 0",
    color: "#333",
    fontSize: "20px",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    margin: "15px 0",
    minHeight: "40px",
  },
  button: {
    marginTop: "15px",
    padding: "10px 30px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default RoleCard;
