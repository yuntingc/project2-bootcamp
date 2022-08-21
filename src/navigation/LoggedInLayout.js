import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../context/userContext";

const LoggedInLayout = () => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  console.log("loggedin layout");

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default LoggedInLayout;
