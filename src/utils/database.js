import { ref, set, push, update, child, get } from "firebase/database";
import { database } from "../firebase";

const USERS_FOLDER_NAME = "users";
const GROUPS_FOLDER_NAME = "groups";
const EVENTS_FOLDER_NAME = "events";

// for conversion to ids
// to convert user email to user id
export const convertEmailToId = async (userEmail) => {
  let userId;

  const dbRef = ref(database);
  await get(child(dbRef, `users`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let userIds = snapshot.val();
        Object.keys(userIds).forEach((key) => {
          if (snapshot.val()[key].email == userEmail) {
            userId = key;
            return userId;
          }
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.log(error);
    });

  return userId;
};

const convertEmailArrToIdArr = async (emailArr) => {
  // convert members email into ids
  const membersId = [];
  emailArr.forEach((email) => {
    convertEmailToId(email).then((id) => {
      membersId.push(id);
    });
  });

  return membersId;
};

// to write data into firebase

// to be used when user first signs up
export const writeUserData = (userId, displayName, displayPicture, email) => {
  set(ref(database, USERS_FOLDER_NAME + "/" + userId), {
    displayName: displayName,
    displayPicture: displayPicture,
    email: email,
  });
};

// to be used when group is first created
export const writeNewGroup = (userId, groupName, members) => {
  // convert members email into ids
  const membersId = [];
  members.forEach(async (email) => {
    console.log("email: ", email);
    let userId = await convertEmailToId(email);
    console.log("userId: ", userId);
    membersId.push(String(userId));
    console.log(membersId); // this works
  });

  // console.log(membersId); // this does not work due to async

  // a group
  const groupData = {
    groupName: groupName,
    membersId: membersId, // this can console log a value out
    members: members,
  };

  console.log("groupData: ", groupData);

  // get key for new grouo
  const newGroupKey = push(child(ref(database), "GROUPS_FOLDER_NAME")).key;

  // write new group's data in groups list and users list
  const updates = {};
  updates[GROUPS_FOLDER_NAME + "/" + newGroupKey] = groupData;
  updates[USERS_FOLDER_NAME + "/" + userId + "/groups/" + newGroupKey] =
    groupData;

  return update(ref(database), updates);
};

// to be used when group is created and the group that the user is in needs to be added under user
export const addUserData = (userId, groupId) => {
  const updates = {};
  update[USERS_FOLDER_NAME + "/" + userId + +"/groups"] = groupId;
  console.log("update", updates);
  console.log("groupid", groupId);
  return update(ref(database), updates);
};

// to be used when group is first created
export const writeUpdateGroup = (userId, groupName, members, groupId) => {
  // convert members email into ids
  const membersId = [];
  members.forEach(async (email) => {
    console.log("email: ", email);
    let userId = await convertEmailToId(email);
    console.log("userId: ", userId);
    membersId.push(String(userId));
    console.log(membersId); // this works
  });

  // console.log(membersId); // this does not work due to async

  // a group
  const groupData = {
    groupName: groupName,
    membersId: membersId, // this can console log a value out
    members: members,
  };

  console.log("groupData: ", groupData);

  // get key for new grouo
  //const newGroupKey = push(child(ref(database), "GROUPS_FOLDER_NAME")).key;

  // write new group's data in groups list and users list
  const updates = {};
  updates[GROUPS_FOLDER_NAME + "/" + groupId] = groupData;
  updates[USERS_FOLDER_NAME + "/" + userId + "/groups/" + groupId] = groupData;

  return update(ref(database), updates);
};

// to be used when user has already signed up
export const writeUpdateProfilePicData = (userId, displayPicture) => {
  const updates = {};
  updates[USERS_FOLDER_NAME + "/" + userId + "/displayPicture"] =
    displayPicture;
  return update(ref(database), updates);
};

export const writeUpdateUsernameData = (userId, displayName) => {
  const updates = {};
  updates[USERS_FOLDER_NAME + "/" + userId + "/displayName"] = displayName;
  return update(ref(database), updates);
};

// to be used when event is first imported
export const writeEventData = (
  eventId,
  eventSummary,
  eventStartTime,
  eventEndTime
) => {
  set(ref(database, EVENTS_FOLDER_NAME + "/" + eventId), {
    eventName: eventSummary,
    eventStartTime: eventStartTime,
    eventEndTime: eventEndTime,
  });
};
