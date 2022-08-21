import { Navigate, Outlet } from "react-router";
import { useUserContext } from "../context/userContext";

const LoggedOutLayout = ({
  toggleLoginPage,
  displayLogin,
  toggleSignUpPage,
}) => {
  const { user } = useUserContext();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default LoggedOutLayout;
