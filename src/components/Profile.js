import { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { auth, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const PROFILE_PICTURE_FOLDER_NAME = "profile-pictures";

const Profile = () => {
  const { user } = useUserContext();
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPic, setCurrentPic] = useState(user.profilePicURL);

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
    await updateProfile(user, { photoURL: profilePicURL });

    toggleEditProfile();
  };

  const toggleEditProfile = () => {
    setIsEditing(!isEditing);
    setCurrentPic(user.photoURL);
  };

  useEffect(() => {}, []);

  return (
    <div>
      {!isEditing && (
        <div>
          <h1>Profile</h1>
          <img src={user.photoURL} />
          <h3>Username : {user.displayName}</h3>
          <h3>Email : {user.email}</h3>
          <button onClick={toggleEditProfile}>Edit Profile</button>
        </div>
      )}

      {isEditing && (
        <div>
          <h1>Editing Profile</h1>
          <img src={currentPic} />
          <div>
            <input
              id="file"
              type="file"
              accept="
            image/png, image/jpeg"
              onChange={changeProfilePic}
            />
          </div>
          <h3>Username : {user.displayName}</h3>
          <h3>Email : {user.email}</h3>
          <button disabled={loading} onClick={saveProfile}>
            Save
          </button>
          <button disabled={loading} onClick={toggleEditProfile}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
