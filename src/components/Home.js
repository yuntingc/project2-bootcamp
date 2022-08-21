import { useEffect } from "react";
import { useUserContext } from "../context/userContext";
import Profile from "./Profile";

import Navbar from "./Navbar";

const Home = () => {
  const { user } = useUserContext();

  useEffect(() => {}, [user.displayName]);

  return <div>HOME PAGE</div>;
};

export default Home;
