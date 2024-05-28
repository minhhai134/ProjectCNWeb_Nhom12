import React from "react";
import { Avatar, Box, Fade, Menu, MenuItem, Stack } from "@mui/material";

import { faker } from "@faker-js/faker";

import { Profile_Menu } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../../redux/slices/auth";
import { LogoutUserConv } from "../../redux/slices/conversation";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const {user} = useSelector((state) => state.app);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const user_id = window.localStorage.getItem("user_id");
  const{displayName}=useSelector((state => state.auth))

  return (
    <>
      <Avatar
        id="profile-positioned-button"
        aria-controls={openMenu ? "profile-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
        alt={displayName}
        onClick={handleClick}
      />
      <Menu
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        TransitionComponent={Fade}
        id="profile-positioned-menu"
        aria-labelledby="profile-positioned-button"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box p={1}>
          <Stack spacing={1}>
            {Profile_Menu.map((el, idx) => (
              <MenuItem onClick={handleClose}>
                <Stack
                  onClick={() => {
                    if(idx === 0) {
                      navigate("/profile");
                    }
                    else {
                      dispatch(LogoutUser());
                      dispatch(LogoutUserConv());
                    }
                  }}
                  sx={{ width: 100 }}
                  direction="row"
                  alignItems={"center"}
                  justifyContent="space-between"
                >
                  <span>{el.title}</span>
                  {el.icon}
                </Stack>{" "}
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
