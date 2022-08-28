import "./App.css";
import React, { useEffect, useState } from "react";
import { useUserContext } from "./context/userContext";

import LoggedOutLayout from "./navigation/LoggedOutLayout";
import LoggedInLayout from "./navigation/LoggedInLayout";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Groups from "./components/Groups";

import { auth } from "./firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const { user, setUser } = useUserContext();
  const [displayLogin, setDisplayLogin] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log("user logged in");
        //console.log("user logged in", user);
      } else {
        console.log("user signed out / not logged in");
        await setUser("");
      }
    });
  }, []);

  const signOut = () => {
    console.log("signout", user);
    // clear local storage used to store access token
    localStorage.clear();
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
          <Route path="/logout" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
