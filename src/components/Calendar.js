import GoogleAuth from "./GoogleAuth";
import { getEvents } from "../utils/googleapi";

const Calendar = () => {
  return (
    <div>
      CALENDAR PAGE
      <GoogleAuth />
      <button onClick={getEvents}>Get Events</button>
    </div>
  );
};

export default Calendar;
