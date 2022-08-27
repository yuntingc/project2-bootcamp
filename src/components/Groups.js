import CreateGroup from "./CreateGroup";
import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";
import { useUserContext } from "../context/userContext";
import { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  getImageListItemBarUtilityClass,
} from "@mui/material";

const USERS_FOLDER_NAME = "users";
const GROUPS_FOLDER_NAME = "groups";

const Groups = () => {
  const { user } = useUserContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [groupId, setGroupId] = useState("");

  const writeUserData = () => {
    set(ref(database, USERS_FOLDER_NAME + "/" + user.uid), {
      groups: groupId,
    });
  };

  const writeGroupData = () => {
    let membersObj = {};
    for (const member of members) {
      if (member in membersObj) {
        membersObj[member] = true;
      } else {
        membersObj[member] = true;
      }
    }

    console.log("membersObj", membersObj);

    // save data for group name and owner
    set(ref(database, GROUPS_FOLDER_NAME + "/" + groupId), {
      groupName: groupName,
      members: members,
    });
  };

  const handleCloseDialog = () => {
    // this is not resetting the inputs!!!
    // however it may not matter if im using it to save to database only
    setGroupId("");
    setGroupName("");
    setMembers([]);
    console.log(groupId);
    console.log(groupName);
    console.log(members);
    setDialogOpen(false);
  };

  const handleOpenDialog = () => {
    // use new form every time dialog is opened
    setGroupId(uuidv4());
    setMembers([auth.currentUser.email, ""]);
    setDialogOpen(true);
  };

  const handleFormSubmit = () => {
    // only upon pressing save, push information to database
    writeGroupData();
    writeUserData();

    console.log("formSubmitted");
    console.log(groupId);
    console.log(groupName);
    console.log(members);
    setGroupId("");
    setDialogOpen(false);
  };

  useEffect(() => {}, []);

  return (
    <div>
      <h1>Your Groups</h1>
      <Button onClick={handleOpenDialog} variant="contained">
        Create Group
      </Button>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle> New Group </DialogTitle>
        <DialogContent>
          <CreateGroup
            members={members}
            setMembers={setMembers}
            groupName={groupName}
            setGroupName={setGroupName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Groups;
