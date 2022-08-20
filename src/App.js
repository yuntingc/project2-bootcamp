import React, { useEffect, useState } from "react";
import "./App.css";

import { useUserContext } from "./context/userContext";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";

import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase";

const App = () => {
  const { user, setUser } = useUserContext();
  const [displayLogin, setDisplayLogin] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user logged in", user);
      } else {
        console.log("user signed out / not logged in");
        setUser("");
      }
    });
  }, []);

  const signOut = () => {
    auth.signOut();
  };

  const toggleLoginPage = () => {
    console.log("switch to Sign Up page", displayLogin);
    setDisplayLogin(false);
  };

  const toggleSignUpPage = () => {
    console.log("switch to login page", displayLogin);
    setDisplayLogin(true);
  };

  return (
    <div className="App">
      <h1>Next Meet Up</h1>
      {user ? (
        <Home />
      ) : displayLogin ? (
        <Login toggleLoginPage={toggleLoginPage} />
      ) : (
        <SignUp toggleSignUpPage={toggleSignUpPage} />
      )}
      {user && <button onClick={signOut}>Sign Out</button>}
    </div>
  );
};

export default App;
