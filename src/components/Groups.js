import React, { useState, useEffect } from "react";
import { ref, onChildAdded } from "firebase/database";
import { useUserContext } from "../context/userContext";
import { database, auth } from "../firebase";
import CreateGroup from "./CreateGroup";
import EditGroup from "./EditGroup";
import UserGroups from "./UserGroups";
import { writeNewGroup, writeUpdateGroup } from "../utils/database";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const USERS_FOLDER_NAME = "users";
const GROUPS_FOLDER_NAME = "groups";

const Groups = () => {
  const { user } = useUserContext();
  // for forms submission
  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [groupId, setGroupId] = useState("");

  // for forms edit
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // to retrieve data from database
  const [groupsData, setGroupsData] = useState([]);

  const handleCloseDialog = () => {
    // this is not resetting the inputs!!!
    // however it may not matter if im using it to save to database only
    setDialogOpen(false);
    setGroupId("");
    setGroupName("");
    setMembers([]);
    console.log(groupId);
    console.log(groupName);
    console.log(members);
  };

  const handleOpenDialog = () => {
    // use new form every time dialog is opened
    //setGroupId(uuidv4());
    setMembers([auth.currentUser.email, ""]);
    // groupname will be set in the form and group id will be set when item pushes to database
    setDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    // only upon pressing save, push information to database

    await writeNewGroup(user.uid, groupName, members);
    console.log("formSubmitted");

    setDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleEditFormSubmit = () => {
    console.log("for edit form");
    writeUpdateGroup(user.uid, groupName, members, groupId);
    setEditDialogOpen(false);
  };

  useEffect(() => {
    // console.log("useEffect");
    setGroupsData("");
    // console.log(groupsData);
    // // get current info in database
    // const dbRef = ref(database);

    // get(child(dbRef, `users/${user.uid}/groups/`))
    //   .then((snapshot) => {
    //     console.log("show snapshot");
    //     if (snapshot.exists()) {
    //       let groups = snapshot.val(); // this returns object of groups { {key: {groupName, members: {} } } }
    //       console.log("groups", groups);
    //       Object.keys(groups).forEach((key) => {
    //         setGroupsData((prev) => [
    //           ...prev,
    //           {
    //             groupId: key,
    //             groupName: groups[key].groupName,
    //             members: groups[key].members,
    //           },
    //         ]);
    //       });
    //     } else {
    //       console.log("No data available");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    const groups = ref(
      database,
      USERS_FOLDER_NAME + "/" + user.uid + "/groups"
    );

    //onChildAdded to return data for every child at the reference and every subsequent new child
    //Add subsequent child to local component state, to initialise array for new rerender
    onChildAdded(groups, (data) => {
      console.log(data.key);
      setGroupsData((prev) => [
        ...prev,
        {
          groupName: data.val().groupName,
          members: data.val().members,
          groupId: data.key,
        },
      ]);
    });

    // reset states upon rendering
    setGroupId("");
    setGroupName("");
    setMembers([]);

    console.log(groupsData);
  }, []);

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
      <UserGroups
        groupsData={groupsData}
        setEditDialogOpen={setEditDialogOpen}
        setGroupId={setGroupId}
        setGroupName={setGroupName}
        setMembers={setMembers}
      />

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle> Edit Group </DialogTitle>
        <DialogContent>
          <EditGroup
            setEditDialogOpen={setEditDialogOpen}
            setGroupName={setGroupName}
            groupName={groupName}
            setMembers={setMembers}
            members={members}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditFormSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Groups;
