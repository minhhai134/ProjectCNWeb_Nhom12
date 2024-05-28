import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import { format, parseISO, isSameDay } from "date-fns";
import { vi } from 'date-fns/locale';
import { TextMsg } from "../../sections/Dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { AddDirectMessage,SetLatestMessage } from "../../redux/slices/conversation";

const user_id = window.localStorage.getItem("user_id");

const Conversation = ({ isMobile, menu }) => {
  const { current_messages } = useSelector(
    (state) => state.conversation
  );

  const formatTime = (time) => {
    const date = parseISO(time);
    const now = new Date();
  
    // Adjust for GMT+7
    const adjustedDate = new Date(date.getTime());
  
    if (isSameDay(adjustedDate, now)) {
      return format(adjustedDate, "HH:mm", { locale: vi });
    } else {
      return format(adjustedDate, "dd/MM/yyyy", { locale: vi });
    }
  };

  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        {current_messages.map((el, idx) => {
          return (
            <TextMsg
              key={idx}
              content={el.content}
              incoming={el.sender !== user_id}
              sentTime={formatTime(el.sentTime)}
              menu={menu}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

const ChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
  const messageListRef = useRef(null);
  const { current_messages } = useSelector(
    (state) => state.conversation
  );

  const dispatch = useDispatch();

  useEffect(() => {
      socket.on("trans-msg", (msg) => {
        dispatch(AddDirectMessage({ message: msg }));
        dispatch(SetLatestMessage({ message: msg }));
        console.log(msg)
      });
      return () => {
        socket.off("trans-msg");
      };
  }, [dispatch]);

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      <ChatHeader />
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflow: "scroll",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <SimpleBarStyle timeout={500} clickOnTrack={false}>
          <Conversation menu={true} isMobile={isMobile} />
        </SimpleBarStyle>
      </Box>
      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;
export { Conversation };
