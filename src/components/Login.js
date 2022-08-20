import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserContext } from "../context/userContext";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";

const Login = ({ toggleLoginPage }) => {
  const { register, handleSubmit } = useForm();
  const { user, setUser } = useUserContext();

  let wrongLoginMessage;

  const onSubmit = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
      })
      .catch((error) => {
        console.log("login failed");
        const errorCode = error.code;
        const errorMessage = error.message;
        wrongLoginMessage = "Invalid email and/or password.";
      });
  };

  return (
    <div>
      <h3>Login Page</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Enter email" {...register("email")}></input>
        <input placeholder="Enter password" {...register("password")}></input>
        <input type="submit"></input>
      </form>
      {wrongLoginMessage}
      <p>New User?</p>
      <button onClick={toggleLoginPage}>SIGN UP NOW</button>
    </div>
  );
};

export default Login;
