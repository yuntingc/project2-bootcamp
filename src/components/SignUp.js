import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { useUserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import {
  Stack,
  Container,
  Button,
  Typography,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormControl,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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

const SignUp = ({ toggleSignUpPage }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { user, setUser } = useUserContext();

  const onSubmit = async (data) => {
    console.log({ data });

    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        console.log("user has signed up");
        const user = userCredential.user;
        await setUser(user);
        try {
          await updateProfile(user, { displayName: data.username });
          console.log("username/displayname updated");
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log("sign up failed");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <div>
      <h3>Welcome to Next Meet Up!</h3>
      <Container>
        <Container maxWidth="xs">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: "bold" }}>
                Create your new account
              </Typography>

              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    name={name}
                    variant="outlined"
                    label="Username"
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={register("username")} // wire up the input ref
                    placeholder="Enter username"
                    helperText={errors.username?.message}
                  />
                )}
                name="username"
                control={control}
                rules={{ required: true }}
              />
              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <TextField
                    name={name}
                    variant="outlined"
                    label="Email"
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    placeholder="Enter email"
                    helperText={errors.email?.message}
                  />
                )}
                name="email"
                control={control}
                rules={{ required: true }}
              />
              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name={name}
                      variant="outlined"
                      label="Password"
                      value={value}
                      onChange={onChange} // send value to hook form
                      onBlur={onBlur} // notify when input is touched
                      inputRef={ref} // wire up the input ref
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            // onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.password?.message}</FormHelperText>
                  </FormControl>
                )}
                name="password"
                control={control}
                rules={{ required: true }}
              />

              <Controller
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password2">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password2"
                      name={name}
                      variant="outlined"
                      label="Confirm password"
                      value={value}
                      onChange={onChange} // send value to hook form
                      onBlur={onBlur} // notify when input is touched
                      inputRef={ref} // wire up the input ref
                      placeholder="Confirm password"
                      type={showPassword2 ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword2}
                            // onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword2 ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText>{errors.password2?.message}</FormHelperText>
                  </FormControl>
                )}
                name="password2"
                control={control}
                rules={{ required: true }}
              />
            </Stack>
            <Button
              variant="contained"
              sx={{ width: 3 / 4, alignSelf: "center", py: 1.3, mt: 3 }}
              onSubmit={handleSubmit(onSubmit)}
              type="submit"
            >
              Sign Up
            </Button>
          </form>
        </Container>
      </Container>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          mt: 1.5,
        }}
      >
        <Typography sx={{ pr: 1 }}>Already have an account?</Typography>
        <Link to="../login" onClick={toggleSignUpPage}>
          Login
        </Link>
      </Container>
    </div>
  );
};

export default SignUp;
