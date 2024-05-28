import React, { useState, useCallback, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CaretDown } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { UpdateBlockStatus } from "../../redux/slices/conversation";
import debounce from "lodash.debounce"; 
import { socket } from "../../socket"; 

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Conversation_Menu = [
  {
    title: "Block this user",
    action: "block",
  },
];

const ChatHeader = () => {
  const dispatch = useDispatch();
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const { conversationsList, currentConversationId, pendingConversationsList } = useSelector((state) => state.conversation);
  const { user_id } = useSelector((state) => state.auth);

  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] = useState(null);
  const openConversationMenu = Boolean(conversationMenuAnchorEl);
  const handleClickConversationMenu = (event) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };
  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };

  useEffect(() => {
    const handleBlock = (userID, convID) => {
      dispatch(UpdateBlockStatus(convID, userID));
    };

    socket.on("blocked", handleBlock);

    return () => {
      socket.off("blocked", handleBlock);
    };
  }, [dispatch, user_id]);

  const handleBlockUser = async () => {
    if (!currentConversationId) return;
  
    const convID = currentConversationId.conversationId;
    const status = user_id;
  
    try {
      // Gửi yêu cầu POST để cập nhật trạng thái block
      const body = new URLSearchParams({
        convID,
        status,
      });
  
      const response = await axios.post("/blockStatus", body);
      console.log("Block status updated successfully:", response.data);
  
      // Cập nhật trạng thái block trong Redux
      dispatch(UpdateBlockStatus(convID, status));
  
      // Gửi sự kiện socket để thông báo trạng thái block
      const receiverId = getReceiverId(convID);
      if (receiverId) {
        const blockObj = {
          user1: user_id,
          user2: receiverId,
          conv: convID,
        };
        socket.emit("blockUser", blockObj);
      }
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };
  
  const getReceiverId = (convId) => {
    const conversation = conversationsList.find(conv => conv._id === convId);
    if (conversation) return conversation.members[0]._id;
    const pendingConversation = pendingConversationsList.find(conv => conv._id === convId);
    return pendingConversation ? pendingConversation.members[0]._id : null;
  };

  const getDisplayName = (convId) => {
    const conversation = conversationsList.find(conv => conv._id === convId);
    if (conversation) {
      return conversation.members[0].displayName;
    }
    const pendingConversation = pendingConversationsList.find(conv => conv._id === convId);
    return pendingConversation ? pendingConversation.members[0].displayName : "Unknown";
  };

  const displayName = getDisplayName(currentConversationId ? currentConversationId.conversationId : "");

  return (
    <>
      <Box
        p={2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          sx={{ width: "100%", height: "100%" }}
          justifyContent="space-between"
        >
          <Stack
            onClick={() => {
              dispatch(ToggleSidebar());
            }}
            spacing={2}
            direction="row"
          >
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <Avatar
                  alt={displayName}
                  src={''}
                />
              </StyledBadge>
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {displayName}
              </Typography>
              <Typography variant="caption">Online</Typography>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={isMobile ? 1 : 3}
          >
            <Divider orientation="vertical" flexItem />
            <IconButton
              id="conversation-positioned-button"
              aria-controls={
                openConversationMenu
                  ? "conversation-positioned-menu"
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={openConversationMenu ? "true" : undefined}
              onClick={handleClickConversationMenu}
            >
              <CaretDown />
            </IconButton>
            <Menu
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              TransitionComponent={Fade}
              id="conversation-positioned-menu"
              aria-labelledby="conversation-positioned-button"
              anchorEl={conversationMenuAnchorEl}
              open={openConversationMenu}
              onClose={handleCloseConversationMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box p={1}>
                <Stack spacing={1}>
                  {Conversation_Menu.map((el) => (
                    <MenuItem
                      key={el.title}
                      onClick={() => {
                        handleCloseConversationMenu();
                        if (el.action === "block") {
                          handleBlockUser();
                        }
                      }}
                    >
                      <Stack
                        sx={{ minWidth: 100 }}
                        direction="row"
                        alignItems={"center"}
                        justifyContent="space-between"
                      >
                        <span>{el.title}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Stack>
              </Box>
            </Menu>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default ChatHeader;
