// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";

// Components
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/dashboard";
import InterviewSetup from "./components/Interview/InterviewSetUp";
import InterviewSession from "./components/Interview/InterviewSession";
import Feedback from "./components/Interview/Feedback";
import History from "./components/History/History";

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/interview-setup/:roleId"
          element={user ? <InterviewSetup /> : <Navigate to="/login" />}
        />
        <Route
          path="/interview/:roleId/:level"
          element={user ? <InterviewSession /> : <Navigate to="/login" />}
        />
        <Route
          path="/feedback"
          element={user ? <Feedback /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={user ? <History /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

const styles = {
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "24px",
  },
};

export default App;
