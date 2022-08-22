import { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import defaultProfilePic from "../avatars/avatar-default.png";
import { Container, Box, TextField, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const PROFILE_PICTURE_FOLDER_NAME = "profile-pictures";

//use yup package for validation
const schema = yup.object().shape({
  username: yup
    .string()
    .max(15, "Username can have a maximum of 15 characters.")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed."),
});

const EditProfile = () => {
  const { user } = useUserContext();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPic, setCurrentPic] = useState(user.photoURL);

  // get reference to service and point to folder/file to save as
  const profilePicsRef = ref(
    storage,
    PROFILE_PICTURE_FOLDER_NAME + "/" + user.uid
  );

  // selecting of file
  const changeProfilePic = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      // to display current file selected
      setCurrentPic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const saveProfile = async (data) => {
    //save url as user profile pic url only upon clicking the save button

    // actual upload of file into firebase storage
    // set a state for loading so that user cannot cancel/save profile in the middle
    setLoading(true);

    // if there are no changes to profile pic, then no file upload is required
    console.log(file);
    if (file) {
      await uploadBytes(profilePicsRef, file).then(() => {
        getDownloadURL(profilePicsRef).then(async (fileURL) => {
          setLoading(false);
          console.log("file is uploaded");

          await updateProfile(user, {
            photoURL: fileURL,
          });
        });
      });
    }

    await updateProfile(user, {
      displayName: data.username,
    });
    console.log("data", data);

    toggleEditProfile();
  };

  const toggleEditProfile = () => {
    navigate("../profile");
  };

  useEffect(() => {
    if (currentPic) {
      setCurrentPic(user.photoURL);
    } else {
      setCurrentPic(defaultProfilePic);
    }
  }, []);

  return (
    <div>
      <h1>Edit Profile</h1>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          <input
            id="profilefile"
            type="file"
            accept="
            image/png, image/jpeg"
            onChange={changeProfilePic}
          />
          <img src={currentPic} width={150} />
          <Box sx={{ alignSelf: "baseline" }}>
            <PhotoCamera />
          </Box>
        </IconButton>
      </Container>

      <form>
        <Controller
          control={control}
          name="username"
          defaultValue={user.displayName}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value}
              id="outlined-required"
              label="Username"
            />
          )}
          rules={{ required: true }}
        />
        <Box sx={{ color: "red" }}>{errors.username?.message}</Box>
        <h3>Email : {user.email}</h3>

        <Button
          disabled={loading}
          onClick={handleSubmit(saveProfile)}
          variant="contained"
          sx={{ mx: 1, mb: 1, px: 3.3 }}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            reset();
            toggleEditProfile();
          }}
          variant="outlined"
          disabled={loading}
          sx={{ mb: 1 }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;
