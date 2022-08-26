const google = window.google;
var axios = require("axios");

let client;

const getCalendarId = async () => {
  let token = localStorage.getItem("accessToken");
  let calendarId;

  var config = {
    method: "get",
    url: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios(config)
    .then(function (response) {
      calendarId = response.data.items[0].id;
    })
    .catch(function (error) {
      console.log(error);
    });

  return calendarId;
};

const getEventIds = async () => {
  let token = localStorage.getItem("accessToken");
  let calendarId = await getCalendarId();
  let eventIdArr = [];

  var config = {
    method: "get",
    url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  await axios(config)
    .then(function (response) {
      response.data.items.forEach((event) => {
        eventIdArr.push(event.id);
      });
    })
    .catch(function (error) {
      console.log(error);
    });

  return eventIdArr;
};

export const getEvents = async () => {
  let token = localStorage.getItem("accessToken");
  let calendarId = await getCalendarId();
  let eventIds = await getEventIds();
  let eventsArr = [];

  eventIds.forEach(async (eventId, i) => {
    var config = {
      method: "get",
      url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios(config)
      .then(function (response) {
        eventsArr.push(response.data);
        console.log("events", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return eventsArr;
};

const initClient = () => {
  client = google.accounts.oauth2.initTokenClient({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: "https://www.googleapis.com/auth/calendar.readonly",

    callback: (tokenResponse) => {
      let token = tokenResponse.access_token;
      localStorage.setItem("accessToken", token);
      console.log("access token init client", token);
      getEvents();
    },
  });
};

export const authoriseCalendar = async () => {
  console.log("init client and get token");
  initClient();
  await client.requestAccessToken();
};
