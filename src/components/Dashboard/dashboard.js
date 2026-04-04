// import React from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../../services/firebase";
// import { useNavigate } from "react-router-dom";

// const roles = [
//   { id: "frontend", name: "Frontend Developer", icon: "💻" },
//   { id: "backend", name: "Backend Developer", icon: "⚙️" },
//   { id: "fullstack", name: "Full-Stack Developer", icon: "🚀" },
//   { id: "java", name: "Java Developer", icon: "☕" },
//   { id: "datascience", name: "Data Scientist/ML Engineer", icon: "📊" },
// ];

// function Dashboard() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/login");
//   };

//   const handleRoleSelect = (roleId) => {
//     navigate(`/interview-setup/${roleId}`);
//   };

//   return (
//     <div style={styles.container}>
//       <nav style={styles.nav}>
//         <h2>AI Interview Platform</h2>
//         <div>
//           <button onClick={() => navigate("/history")} style={styles.navButton}>
//             History
//           </button>
//           <button onClick={handleLogout} style={styles.logoutButton}>
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div style={styles.content}>
//         <h1>Select Your Role</h1>
//         <p style={styles.subtitle}>
//           Choose the position you want to practice for
//         </p>

//         <div style={styles.rolesGrid}>
//           {roles.map((role) => (
//             <div
//               key={role.id}
//               style={styles.roleCard}
//               onClick={() => handleRoleSelect(role.id)}
//             >
//               <div style={styles.icon}>{role.icon}</div>
//               <h3>{role.name}</h3>
//               <button style={styles.startButton}>Start Interview</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f5f5f5",
//   },
//   nav: {
//     backgroundColor: "white",
//     padding: "20px 40px",
//     boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   navButton: {
//     padding: "10px 20px",
//     marginRight: "10px",
//     backgroundColor: "#2196F3",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   logoutButton: {
//     padding: "10px 20px",
//     backgroundColor: "#f44336",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   content: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "40px",
//   },
//   subtitle: {
//     color: "#666",
//     marginBottom: "40px",
//   },
//   rolesGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "30px",
//   },
//   roleCard: {
//     backgroundColor: "white",
//     padding: "30px",
//     borderRadius: "10px",
//     textAlign: "center",
//     cursor: "pointer",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     transition: "transform 0.2s",
//     ":hover": {
//       transform: "translateY(-5px)",
//     },
//   },
//   icon: {
//     fontSize: "48px",
//     marginBottom: "15px",
//   },
//   startButton: {
//     marginTop: "15px",
//     padding: "10px 30px",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "14px",
//   },
// };

// export default Dashboard;

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import RoleCard from "./Rolecard";

const roles = [
  {
    id: "frontend",
    name: "Frontend Developer",
    icon: "💻",
    description: "HTML, CSS, JavaScript, React",
  },
  {
    id: "backend",
    name: "Backend Developer",
    icon: "⚙️",
    description: "Node.js, APIs, Databases",
  },
  {
    id: "fullstack",
    name: "Full-Stack Developer",
    icon: "🚀",
    description: "Frontend + Backend skills",
  },
  {
    id: "java",
    name: "Java Developer",
    icon: "☕",
    description: "Java, Spring Boot, OOP",
  },
  {
    id: "datascience",
    name: "Data Scientist/ML Engineer",
    icon: "📊",
    description: "Python, ML, Statistics",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleRoleSelect = (roleId) => {
    navigate(`/interview-setup/${roleId}`);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2>🎤 AI Interview Platform</h2>
        <div>
          <button onClick={() => navigate("/history")} style={styles.navButton}>
            📚 History
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1>Select Your Role</h1>
        <p style={styles.subtitle}>
          Choose the position you want to practice for
        </p>

        <div style={styles.rolesGrid}>
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} onSelect={handleRoleSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  nav: {
    backgroundColor: "white",
    padding: "20px 40px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    padding: "10px 20px",
    marginRight: "10px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "40px",
    fontSize: "18px",
  },
  rolesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
};

export default Dashboard;
