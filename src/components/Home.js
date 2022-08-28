import { useEffect, useState } from "react";
import { authoriseCalendar, getEvents } from "../utils/googleapi";
import { Button, Box, Card, Container, Typography } from "@mui/material";

const Home = () => {
  const [events, setEvents] = useState();

  const runGetEvents = async () => {
    let eventArr = await getEvents();
    // sort events
    setEvents(eventArr);
    console.log("eventArr: ", eventArr);
    console.log("events: ", events);
  };

  const runAuthoriseCalendar = async () => {
    await authoriseCalendar();
    await runGetEvents();
  };
  useEffect(() => {}, [events]);

  return (
    <Container>
      <Typography sx={{ fontWeight: "bold", fontSize: 20, m: 2 }}>
        Upcoming Events
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <button id="authorise-google-btn" onClick={runAuthoriseCalendar}>
          Authorise Google Calendar
        </button>
        <Button variant="contained" onClick={runGetEvents} sx={{ mx: 1 }}>
          Get Events
        </Button>
      </Box>
      <Container sx={{ mt: 5, flexWrap: "wrap", display: "flex" }}>
        {events &&
          Object.values(events).map(({ summary, start, end }, index) => {
            return (
              <Container
                key={index}
                sx={{
                  m: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card variant="outlined" sx={{ maxWidth: 250, minWidth: 300 }}>
                  <Typography sx={{ fontWeight: "bold", fontStyle: "italic" }}>
                    {" "}
                    {summary}
                  </Typography>
                  <Typography>
                    Start:{" "}
                    {start.date
                      ? new Date(start.date).toLocaleDateString()
                      : new Date(start.dateTime).toLocaleString()}
                  </Typography>
                  <Typography>
                    End:{" "}
                    {end.date
                      ? new Date(end.date).toLocaleDateString()
                      : new Date(end.dateTime).toLocaleString()}
                  </Typography>
                </Card>
              </Container>
            );
          })}
      </Container>
    </Container>
  );
};

export default Home;
