import { useUserContext } from "../context/userContext";
import { authoriseCalendar } from "../utils/googleapi";

const GoogleAuth = () => {
  const { user, setUser } = useUserContext();

  return (
    <div>
      <button onClick={authoriseCalendar}>Authorise Google Calendar</button>
    </div>
  );
};

export default GoogleAuth;
