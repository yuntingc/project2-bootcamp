import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// use yup package for validation
const schema = yup.object().shape({
  username: yup
    .string()
    .max(15, "Username can have a maximum of 15 characters.")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed.")
    .required("Please enter a username"),
  email: yup.string().email("Please enter a valid email."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(15, "Password can have a maximum of 15 characters.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/,
      `Password must:\n• be alphanumeric\n• have at least 1 lower and upper case letter\n• contains a special character`
    )
    .required("Please enter a password."),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match!")
    .required("Please re-enter to confirm your password."),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log({ data });
  };

  return (
    <div>
      <h3>Sign Up Form</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Enter username" {...register("username")}></input>
        <p> {errors.username?.message}</p>
        <input placeholder="Enter email" {...register("email")}></input>
        <p>{errors.email?.message}</p>
        <input placeholder="Enter password" {...register("password")}></input>
        <p style={{ whiteSpace: "pre-wrap" }}>{errors.password?.message}</p>
        <input
          placeholder="Confirm password"
          {...register("password2")}
        ></input>
        <p>{errors.password2?.message}</p>
        <input type="submit" />
      </form>
    </div>
  );
};

export default SignUp;
