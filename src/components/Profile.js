import { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { auth, storage } from "../firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const PROFILE_PICTURE_FOLDER_NAME = "profile-pictures";

//use yup package for validation
const schema = yup.object().shape({
  username: yup
    .string()
    .max(15, "Username can have a maximum of 15 characters.")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed."),
});

const Profile = () => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPic, setCurrentPic] = useState(user.profilePicURL);
  const [currentUsername, setCurrentUsername] = useState(user.displayName);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const confirmProfilePic = () => {
    // set a state for loading so that user cannot cancel/save profile in the middle

    setLoading(true);

    uploadBytes(profilePicsRef, file).then(() => {
      getDownloadURL(profilePicsRef).then((fileURL) => {
        setProfilePicURL(fileURL);
        setLoading(false);
        console.log("file is uploaded");
      });
    });
  };

  const saveProfile = async () => {
    //save url as user profile pic url only upon clicking the save button
    confirmProfilePic(); // this includes the actual upload of file into firebase storage

    await updateProfile(user, {
      photoURL: profilePicURL,
      displayName: currentUsername,
    });

    toggleEditProfile();
  };

  const toggleEditProfile = () => {
    setIsEditing(!isEditing);
    setCurrentPic(user.photoURL);
    setCurrentUsername(user.displayName);
  };

  useEffect(() => {}, []);

  const handleChangeUsername = (e) => {
    setCurrentUsername(e.target.value);
  };

  return (
    <div>
      {!isEditing && (
        <div>
          <h1>Profile</h1>
          <img src={user.photoURL} width={50} />
          <h3>Username : {user.displayName}</h3>
          <h3>Email : {user.email}</h3>
          <button onClick={toggleEditProfile}>Edit Profile</button>
        </div>
      )}

      {isEditing && (
        <div>
          <h1>Editing Profile</h1>
          <img src={currentPic} width={50} />
          <div>
            <input
              id="file"
              type="file"
              accept="
            image/png, image/jpeg"
              onChange={changeProfilePic}
            />
          </div>
          <div>
            <h3>Username : {user.displayName}</h3>
            <form onSubmit={handleSubmit(saveProfile)}>
              <div>New Username: </div>
              <input
                name="username"
                placeholder="Enter New username"
                {...register("username")}
                onChange={handleChangeUsername}
              ></input>
              <p>{errors.username?.message}</p>
              <h3>Email : {user.email}</h3>{" "}
              <button type="submit" disabled={loading}>
                Save
              </button>
              <button disabled={loading} onClick={toggleEditProfile}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
