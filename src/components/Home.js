import { useUserContext } from "../context/userContext";

const Home = () => {
  const { user } = useUserContext();

  return (
    <div>
      {/* Note: displayName is not shown when user first enters via the signup page */}
      <h1>Welcome {user.displayName}!!</h1>
      <p>THIS IS THE HOME PAGE!!</p>
    </div>
  );
};

export default Home;
