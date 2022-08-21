import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useUserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebase";

const pages = ["Home", "Groups", "Calendar"];
const settings = ["Profile", "Logout"];

const Navbar = ({ signOut }) => {
  //nav bar handles
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (e) => {
    setAnchorElUser(null);
    console.log(e);

    // if sign out button is clicked, then run the signout function
    if (e.target.id === "logout") {
      signOut();
    }
  };

  // start of code
  const { user } = useUserContext();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {user && (
            <Box>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Link
                    to={page.toLowerCase()}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  </Link>
                ))}
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Link
                        to={page.toLowerCase()}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <Typography textAlign="center">{page}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
          )}

          <AdbIcon
            sx={{
              display: {
                xs: "none",
                md: "none",
              },
              mr: 1,
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "flex" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AdbIcon
              sx={{
                display: {
                  xs: "flex",
                  md: "flex",
                },
                mr: 1,
              }}
            />

            <Box>NEXT MEET UP</Box>
          </Typography>

          {user && (
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                }}
              >
                {user.displayName}
              </Box>
              <Box>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.displayName} src={user.photoURL} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Link
                      to={setting.toLowerCase()}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <Typography textAlign="center" id={setting.toLowerCase()}>
                        {setting}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
