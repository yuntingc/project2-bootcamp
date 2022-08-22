import React, { useEffect, useState } from "react";
import "./App.css";

import { useUserContext } from "./context/userContext";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import LoggedOutLayout from "./navigation/LoggedOutLayout";
import LoggedInLayout from "./navigation/LoggedInLayout";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";

import Groups from "./components/Groups";
import Calendar from "./components/Calendar";

import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase";
import { Route, Routes, Navigate } from "react-router-dom";

const App = () => {
  const { user, setUser } = useUserContext();
  const [displayLogin, setDisplayLogin] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user logged in", user);
      } else {
        console.log("user signed out / not logged in");
        await setUser("");
      }
    });
  }, []);

  const signOut = () => {
    console.log("signout", user);
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
      {/* <GoogleAuth /> */}
      <Navbar signOut={signOut} />

      <Routes>
        <Route
          element={
            <LoggedOutLayout
              toggleLoginPage={toggleLoginPage}
              displayLogin={displayLogin}
              toggleSignUpPage={toggleSignUpPage}
            />
          }
        >
          <Route
            path="/login"
            element={
              <Login
                toggleLoginPage={toggleLoginPage}
                displayLogin={displayLogin}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp
                displayLogin={displayLogin}
                toggleSignUpPage={toggleSignUpPage}
              />
            }
          />
        </Route>

        <Route element={<LoggedInLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
