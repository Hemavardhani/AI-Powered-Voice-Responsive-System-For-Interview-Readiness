// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, db } from "../../services/firebase";
// import { useNavigate } from "react-router-dom";

// function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password,
//       );
//       const user = userCredential.user;

//       // Create user document in Firestore
//       await setDoc(doc(db, "users", user.uid), {
//         name: name,
//         email: email,
//         createdAt: new Date().toISOString(),
//         interviewHistory: [],
//       });

//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h1>Sign Up</h1>
//         <form onSubmit={handleSignUp}>
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <input
//             type="password"
//             placeholder="Password (min 6 characters)"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={styles.input}
//           />
//           <button type="submit" style={styles.button}>
//             Sign Up
//           </button>
//         </form>
//         {error && <p style={styles.error}>{error}</p>}
//         <p>
//           Already have an account? <a href="/login">Login</a>
//         </p>
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
//   },
//   card: {
//     backgroundColor: "white",
//     padding: "40px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//     width: "400px",
//   },
//   input: {
//     width: "100%",
//     padding: "12px",
//     margin: "10px 0",
//     border: "1px solid #ddd",
//     borderRadius: "5px",
//     fontSize: "16px",
//     boxSizing: "border-box",
//   },
//   button: {
//     width: "100%",
//     padding: "12px",
//     marginTop: "20px",
//     backgroundColor: "#4CAF50",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//   },
//   error: {
//     color: "red",
//     marginTop: "10px",
//   },
// };

// export default SignUp;

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Create user document in Firestore with proper structure
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        interviewHistory: [], // Initialize empty array
      });

      console.log("User created successfully:", user.uid);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);

      // Handle specific Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎤 Create Account</h1>
        <p style={styles.subtitle}>Join the AI Interview Platform</p>

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <p style={styles.loginLink}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Login here
          </a>
        </p>
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
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "#d32f2f",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "5px",
    textAlign: "center",
  },
  loginLink: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
  },
  link: {
    color: "#2196F3",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default SignUp;
