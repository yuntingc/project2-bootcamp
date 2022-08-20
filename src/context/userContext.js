import React, { useContext, useState } from "react";

// create context
const UserContext = React.createContext();

// provide context
const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// use context
const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within UserContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
