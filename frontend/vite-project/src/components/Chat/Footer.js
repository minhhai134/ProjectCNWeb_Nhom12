import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Button
} from "@mui/material";
import { PaperPlaneTilt, Smiley } from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  SendMessage,
  AddDirectMessage,
  SetLatestMessage,
  UpdateBlockStatus
} from "../../redux/slices/conversation";
import axios from "../../utils/axios";


const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const ChatInput = ({ openPicker, setOpenPicker, setValue, value, inputRef }) => {
  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment>
              <IconButton onClick={() => setOpenPicker(!openPicker)}>
                <Smiley />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
    />
  );
};

const Footer = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { conversationsList, currentConversationId, pendingConversationsList } = useSelector((state) => state.conversation);
  const user_id = window.localStorage.getItem("user_id");
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const { sideBar } = useSelector((state) => state.app);
  const [openPicker, setOpenPicker] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleUnblock = (userID, convID) => {
      dispatch(UpdateBlockStatus(convID, ''));
    };

    socket.on("unblocked", handleUnblock);

    return () => {
      socket.off("unblocked", handleUnblock);
    };
  }, [dispatch, user_id]);

  const handleEmojiClick = (emoji) => {
    const input = inputRef.current;
    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
      setValue(value.substring(0, selectionStart) + emoji + value.substring(selectionEnd));
      input.selectionStart = input.selectionEnd = selectionStart + emoji.length;
    }
  };

  const handleUnBlockUser = async () => {
    if (!currentConversationId) return;
  
    const convID = currentConversationId.conversationId;
    const status = '';
  
    try {
      // Gửi yêu cầu POST để cập nhật trạng thái unblock
      const body = new URLSearchParams({
        convID,
        status,
      });
  
      const response = await axios.post("/blockStatus", body);
      console.log("Block status updated successfully:", response.data);
  
      // Cập nhật trạng thái unblock trong Redux
      dispatch(UpdateBlockStatus(convID, status));
  
      // Gửi sự kiện socket để thông báo trạng thái unblock
      const receiverId = getReceiverId(convID);
      if (receiverId) {
        const blockObj = {
          user1: user_id,
          user2: receiverId,
          conv: convID,
        };
        socket.emit("unblockUser", blockObj);
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

  const getCurrentConvBlockStt = (convId) => {
    const conversation = conversationsList.find(conv => conv._id === convId);
    if (conversation) return conversation.blockStatus;
    const pendingConversation = pendingConversationsList.find(conv => conv._id === convId);
    return pendingConversation ? pendingConversation.blockStatus : null;
  };

  const isBlockedByCurrentUser = getCurrentConvBlockStt(currentConversationId.conversationId) === user_id;
  const isBlockedByOtherUser = getCurrentConvBlockStt(currentConversationId.conversationId) !== '' && getCurrentConvBlockStt(currentConversationId.conversationId) !== user_id;

  return (
    <Box sx={{ position: "relative", backgroundColor: "transparent !important" }}>
      <Box p={isMobile ? 1 : 2} width={"100%"} sx={{ backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background, boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)" }}>
        {isBlockedByCurrentUser ? (
          <Stack alignItems="center" spacing={2}>
            <Typography>Bạn đã chặn người dùng này và không thể gửi hay nhận tin nhắn đến họ</Typography>
            <Button variant="contained" color="secondary" onClick={() => handleUnBlockUser()}>
              Bỏ chặn
            </Button>
          </Stack>
        ) : isBlockedByOtherUser ? (
          <Typography>Bạn đã bị người dùng này chặn và không thể gửi hay nhận tin nhắn đến họ</Typography>
        ) : (
          <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
            <Stack sx={{ width: "100%" }}>
              <Box style={{ zIndex: 10, position: "fixed", display: openPicker ? "inline" : "none", bottom: 81, right: isMobile ? 20 : sideBar.open ? 420 : 100 }}>
                <Picker theme={theme.palette.mode} data={data} onEmojiSelect={(emoji) => handleEmojiClick(emoji.native)} />
              </Box>
              <ChatInput inputRef={inputRef} value={value} setValue={setValue} openPicker={openPicker} setOpenPicker={setOpenPicker} />
            </Stack>
            <Box sx={{ height: 48, width: 48, backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}>
              <Stack sx={{ height: "100%" }} alignItems={"center"} justifyContent="center">
                <IconButton onClick={() => {
                  const receiver = getReceiverId(currentConversationId.conversationId);
                  if (receiver) {
                    const message = {
                      conversation: currentConversationId.conversationId,
                      sender: user_id,
                      receiver,
                      sentTime: (new Date()).toISOString(),
                      content: value,
                    };

                    socket.emit("sendMsg", message);
                    dispatch(AddDirectMessage({ message }));
                    dispatch(SetLatestMessage({ message }));
                    setValue("");
                    dispatch(SendMessage(message));
                  }
                }}>
                  <PaperPlaneTilt color="#ffffff" />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Footer;
