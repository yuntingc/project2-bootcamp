import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useUserContext } from "../context/userContext";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { Link } from "react-router-dom";
import GoogleLogin from "./GoogleLogin";
import {
  Container,
  TextField,
  Stack,
  Button,
  Box,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = ({ toggleLoginPage }) => {
  const { register, handleSubmit, errors, control } = useForm();
  const { user, setUser } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  let wrongLoginMessage = "Login failed. Invalid email and/or password.";

  const onSubmit = (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        setShowErrorMessage(false);
      })
      .catch((error) => {
        console.log("login failed");
        const errorCode = error.code;
        const errorMessage = error.message;
        setShowErrorMessage(true);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <h3>Welcome to Next Meet Up!</h3>
      <h4>Login Page</h4>
      <Container maxWidth="xs">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
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
                </FormControl>
              )}
              name="password"
              control={control}
              rules={{ required: true }}
            />
            <Box sx={{ color: "red" }}>
              {" "}
              {showErrorMessage && wrongLoginMessage}
            </Box>
          </Stack>

          <Button
            variant="contained"
            sx={{ width: 3 / 4, alignSelf: "center", py: 1.3, mt: 2 }}
            onSubmit={handleSubmit(onSubmit)}
            type="submit"
          >
            Login
          </Button>
        </form>
        <Container sx={{ mt: 2 }}>
          <GoogleLogin />
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
        <Box sx={{ pr: 1 }}>New user?</Box>
        <Link to="../signup" onClick={toggleLoginPage}>
          Sign up now
        </Link>
      </Container>
    </div>
  );
};

export default Login;
