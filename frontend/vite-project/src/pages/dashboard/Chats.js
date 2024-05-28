import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "phosphor-react";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { socket, connectSocket, disconnectSocket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchConversations,
  SetLatestMessage,
  FetchCurrentMessages,
  UpdateConversationStatus
} from "../../redux/slices/conversation";
import { format, parseISO, isSameDay, isValid } from "date-fns";
import { vi } from "date-fns/locale";

const Chats = () => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const { conversationsList, pendingConversationsList } = useSelector(
    (state) => state.conversation
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (user_id) {
      dispatch(FetchConversations());
      connectSocket(user_id);

      socket.on("trans-msg", (msg) => {
        console.log(msg)
        dispatch(SetLatestMessage({ message: msg }));
      });

      socket.on("searchUserResult", (result) => {
        console.log("Search results received:", result);
        setSearchResults(result);
      });

      return () => {
        disconnectSocket();
        socket.off("trans-msg");
        socket.off("searchUserResult");
      };
    }
  }, [dispatch, user_id]);

  const handleSearchChange = (event) => {
    const searchStr = event.target.value;
    setSearchTerm(searchStr);

    if (searchStr.length > 0) {
      const user = {
        userID: user_id,
        searchStr,
      };

      if (socket) {
        socket.emit("search_user", user);
        console.log("Searching for user:", user);
      }
    } else {
      setSearchResults([]);
    }
  };

  const formatTime = (time) => {
    const date = parseISO(time);
    const now = new Date();

    const adjustedDate = new Date(date.getTime());

    if (isSameDay(adjustedDate, now)) {
      return format(adjustedDate, "HH:mm", { locale: vi });
    } else {
      return format(adjustedDate, "dd/MM/yyyy", { locale: vi });
    }
  };

  const handleSearchResultClick = async (friendID) => {
    try {
      const url = "http://localhost:8000/api/conversation";
      const members = [user_id.toString(), friendID.toString()];

      let body = new URLSearchParams();
      body.append("members", members);

      const req1 = {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      };

      let res = await callAPI(url, req1);
      console.log(res);

      if (!res || !res.data || !res.data._id) {
        console.warn(
          "PUT request did not return a valid conversation, attempting to create a new one",
          res
        );

        const req2 = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        };

        res = await callAPI(url, req2);
        console.log(res);

        if (!res || !res.data || !res.data._id) {
          throw new Error("Failed to create or find conversation.");
        }
      }

      const currentConversation = res.data._id;

      dispatch(FetchCurrentMessages({ conversationId: currentConversation }));
      setSelectedConversation(currentConversation);
      dispatch(FetchConversations());

      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error handling search result click:", error);
    }
  };

  async function callAPI(url, req) {
    try {
      const response = await fetch(url, req);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating document:", error);
      return null;
    }
  }

  const sortedConversationsList = conversationsList.slice().sort((a, b) => {
    const timeA =
      a.latestMessage && isValid(parseISO(a.latestMessage?.sentTime))
        ? parseISO(a.latestMessage?.sentTime)
        : a.lastActive && isValid(parseISO(a.lastActive))
        ? parseISO(a.lastActive)
        : new Date(0); // Default to earliest date if both are missing
    const timeB =
      b.latestMessage && isValid(parseISO(b.latestMessage?.sentTime))
        ? parseISO(b.latestMessage?.sentTime)
        : b.lastActive && isValid(parseISO(b.lastActive))
        ? parseISO(b.lastActive)
        : new Date(0); // Default to earliest date if both are missing
    return timeB - timeA;
  });
  const sortedPendingConversationsList = pendingConversationsList.slice().sort((a, b) => {
    const timeA =
      a.latestMessage && isValid(parseISO(a.latestMessage?.sentTime))
        ? parseISO(a.latestMessage?.sentTime)
        : a.lastActive && isValid(parseISO(a.lastActive))
        ? parseISO(a.lastActive)
        : new Date(0); // Default to earliest date if both are missing
    const timeB =
      b.latestMessage && isValid(parseISO(b.latestMessage?.sentTime))
        ? parseISO(b.latestMessage?.sentTime)
        : b.lastActive && isValid(parseISO(b.lastActive))
        ? parseISO(b.lastActive)
        : new Date(0); // Default to earliest date if both are missing
    return timeB - timeA;
  });

  // Ensure the selected conversation is at the top
  if (selectedConversation) {
    const selectedConvIndex = sortedConversationsList.findIndex(
      (conv) => conv._id === selectedConversation
    );
    if (selectedConvIndex > -1) {
      const [selectedConv] = sortedConversationsList.splice(
        selectedConvIndex,
        1
      );
      sortedConversationsList.unshift(selectedConv);
    }
  }

  const handleChangeStatus = async (conversationId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'accept' ? 'pending' : 'accept';
      dispatch(UpdateConversationStatus(conversationId, newStatus));
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };
  

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {!isDesktop && <BottomNav />}

        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h5">Chats</Typography>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Search>
          </Stack>
          <Divider />
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Tin nhắn" />
            <Tab label="Tin nhắn chờ" />
          </Tabs>
          <Divider />
          <Stack sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <Stack spacing={2.4}>
                {searchResults.length > 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                      Search Results
                    </Typography>
                    {searchResults.map((user, idx) => (
                      <ChatElement
                        key={idx}
                        displayName={user._id === user_id ? "Bạn" : user.displayName}
                        onClick={() => handleSearchResultClick(user._id)}
                      />
                    ))}
                    <Divider />
                  </>
                )}
                {tab === 0 && (
                  <>
                    <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                      All Chats
                    </Typography>
                    {sortedConversationsList.map((conversation, idx) => (
                      <ChatElement
                        key={idx}
                        {...conversation}
                        displayName={conversation.members[0].displayName}
                        msg={
                          user_id === conversation.latestMessage?.sender
                            ? `Bạn: ${conversation.latestMessage?.content}`
                            : conversation.latestMessage?.content || "No message"
                        }
                        time={
                          conversation.latestMessage
                            ? formatTime(conversation.latestMessage?.sentTime) ||
                              formatTime(conversation.lastActive)
                            : ""
                        }
                        id={conversation._id}
                        onClick={() => {
                          dispatch(
                            FetchCurrentMessages({ conversationId: conversation._id })
                          );
                        }}
                        onChangeStatus={() => handleChangeStatus(conversation._id, 'accept')}
                        status="accept"
                      />
                    ))}
                  </>
                )}
                {tab === 1 && (
                  <>
                    <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                      Pending Chats
                    </Typography>
                    {sortedPendingConversationsList.map((conversation, idx) => (
                      <ChatElement
                        key={idx}
                        {...conversation}
                        displayName={conversation.members[0].displayName}
                        msg={
                          user_id === conversation.latestMessage?.sender
                            ? `Bạn: ${conversation.latestMessage?.content}`
                            : conversation.latestMessage?.content || "No message"
                        }
                        time={
                          conversation.latestMessage
                            ? formatTime(conversation.latestMessage?.sentTime) ||
                              formatTime(conversation.lastActive)
                            : ""
                        }
                        id={conversation._id}
                        onClick={() => {
                          dispatch(
                            FetchCurrentMessages({ conversationId: conversation._id })
                          );
                        }}
                        onChangeStatus={() => handleChangeStatus(conversation._id, 'pending')}
                        status="pending"
                      />
                    ))}
                  </>
                )}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default Chats;
