import { ref, remove } from "firebase/database";
import {
  Avatar,
  Box,
  Card,
  Container,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { useUserContext } from "../context/userContext";
import { database } from "../firebase";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "white",
  border: "2px solid",
  boxShadow: 24,
  p: 4,
};

const UserGroups = ({
  groupsData,
  setEditDialogOpen,
  setGroupId,
  setGroupName,
  setMembers,
}) => {
  const { user } = useUserContext();

  const handleEditDialogOpen = (e) => {
    setEditDialogOpen(true);
    setGroupId(e.currentTarget.id);
    console.log(e.currentTarget.id); // this gives group id

    let groupIndex;

    Object.values(groupsData).map((key) => {
      //console.log(key.groupId, groupId, key.groupId == groupId);
      let currentId = key.groupId;
      if (currentId == e.currentTarget.id) {
        groupIndex = key;
      }
    });

    setGroupName(groupIndex.groupName);
    setMembers(groupIndex.members);
  };

  const handleDeleteGroup = (e) => {
    console.log(e.currentTarget.id); // this gives group id
    remove(ref(database, "groups/" + e.currentTarget.id));
    remove(
      ref(database, "users/" + user.uid + "/groups/" + e.currentTarget.id)
    );
    console.log("removed groups info");
  };

  return (
    <Container sx={{ display: "flex", flexWrap: "wrap" }}>
      {Object.values(groupsData).map(({ groupId, groupName, members }) => {
        return (
          <Container id={groupId} key={groupId} sx={{ maxWidth: 300, p: 1 }}>
            <Card variant="outlined">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                }}
              >
                <Typography sx={{ fontSize: 15, fontWeight: "bold", ml: 2 }}>
                  {groupName}
                </Typography>

                <Box sx={{ display: "flex" }}>
                  <IconButton id={groupId} onClick={handleEditDialogOpen}>
                    <EditIcon />
                  </IconButton>

                  <IconButton id={groupId} onClick={handleDeleteGroup}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography id="modal-modal-description">
                <List>
                  {Object.values(members).map((member, index) => {
                    return (
                      <ListItem
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 1, width: 25, height: 25 }} />
                          <Typography>{member}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 10, fontStyle: "italic" }}>
                          {index == 0 && "Admin"}
                        </Typography>
                      </ListItem>
                    );
                  })}
                </List>
              </Typography>
            </Card>
          </Container>
        );
      })}
    </Container>
  );
};

export default UserGroups;
