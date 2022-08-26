import { useEffect } from "react";
import { useUserContext } from "../context/userContext";

const Home = () => {
  const { user } = useUserContext();

  useEffect(() => {}, [user.displayName]);

  return <div>HOME PAGE</div>;
};

export default Home;
