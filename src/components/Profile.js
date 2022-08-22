import { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import defaultProfilePic from "../avatars/avatar-default.png";
import Button from "@mui/material/Button";

const Profile = () => {
  const { user } = useUserContext();
  const [currentPic, setCurrentPic] = useState(user.photoURL);

  useEffect(() => {
    if (currentPic) {
      setCurrentPic(user.photoURL);
    } else {
      setCurrentPic(defaultProfilePic);
    }
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <img alt="actual" src={currentPic} width={200} />
      <h3>Username : {user.displayName}</h3>
      <h3>Email : {user.email}</h3>
      <Link to="edit" style={{ textDecoration: "none" }}>
        <Button variant="contained">Edit Profile</Button>
      </Link>
    </div>
  );
};

export default Profile;
