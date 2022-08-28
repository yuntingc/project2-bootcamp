import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "@firebase/auth";
import { auth } from "../firebase";
import { useUserContext } from "../context/userContext";
import "../index.css";
import { getDatabase, ref, set } from "firebase/database";
import { database } from "../firebase";
import { writeUserData } from "../utils/database";

const google = window.google;
const axios = require("axios");

const GoogleLogin = () => {
  const { user, setUser } = useUserContext();

  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("user google looged in");

        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        const token = credential.accessToken;
        // The signed-in user info.
        const userInfo = result.user;

        // To switch to home page
        setUser(userInfo);

        localStorage.setItem("accessToken", token);

        //save user data into database
        console.log("saving user data into database");
        writeUserData(
          userInfo.uid,
          userInfo.displayName,
          userInfo.photoURL,
          userInfo.email
        );
      })
      .catch((error) => {
        console.log(error);

        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div>
      <button id="login-with-google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
