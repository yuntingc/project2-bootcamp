import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Button, Box, TextField, Grid, FormControl } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const CreateGroup = ({ members, groupName, setMembers, setGroupName }) => {
  // const [groupName, setGroupName] = useState("");
  // const [members, setMembers] = useState([auth.currentUser.email, ""]);

  const addMemberField = () => {
    let newMember = "";
    setMembers([...members, newMember]);
    console.log(members);
  };

  const removeMemberField = (index) => {
    let data = [...members];
    data.splice(index, 1);
    setMembers(data);
    console.log(members);
  };

  const handleMemberChange = (index, e) => {
    let data = [...members];
    data[index] = e.target.value;
    setMembers(data);
    console.log(members);
  };

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
    console.log(groupName);
  };

  return (
    <div>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            sx={{ mt: 2 }}
            required
            fullWidth
            label="Group Name"
            name="groupName"
            onChange={handleGroupNameChange}
            value={groupName}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ my: 2 }}>Members</Box>
          {members.map((input, index) => {
            return (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", m: 1 }}
              >
                <Box sx={{ mr: 1 }}>{index + 1}</Box>

                <TextField
                  disabled={index === 0}
                  name="members"
                  placeholder="email"
                  value={members[index]}
                  onChange={(e) => handleMemberChange(index, e)}
                />

                <Button
                  onClick={() => removeMemberField(index)}
                  disabled={index === 0}
                >
                  <RemoveCircleIcon />
                </Button>
              </Box>
            );
          })}
          <Button
            variant="outlined"
            onClick={addMemberField}
            sx={{ ml: 1, mt: 2 }}
          >
            Add More Members
          </Button>
        </Grid>
      </FormControl>
    </div>
  );
};

export default CreateGroup;
