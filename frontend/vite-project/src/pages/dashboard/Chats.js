import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
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
import Friends from "../../sections/Dashboard/Friends";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { FetchConversations, SetLatestMessage, FetchCurrentMessages } from "../../redux/slices/conversation";
import { format, parseISO, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import axios from "../../utils/axios";

const Chats = () => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const { conversationsList } = useSelector((state) => state.conversation);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user_id) {
      dispatch(FetchConversations());
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

      socket.emit("search_user", user);
      console.log("Searching for user:", user);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    socket.on("searchUserResult", (result) => {
      console.log("Search results received:", result);
      setSearchResults(result);
    });

    return () => {
      socket.off("searchUserResult");
    };
  }, []);
  useEffect(() => {
    socket.on("trans-msg", (msg) => {
      dispatch(SetLatestMessage({ message: msg }));
    });

    return () => {
      socket.off("trans-msg");
    };
  }, [dispatch]);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

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

  const handleSearchResultClick = async (friendID) => {
    try {
      const url = "http://localhost:8000/api/conversation";
      const members = [user_id.toString(), friendID.toString()];
      console.log(members)
      
      // Create the body using URLSearchParams
      let body = new URLSearchParams();
      body.append("members",members);
      console.log(body.toString())
  
      // Check if the conversation exists
      const req1 = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
      };
  
      let res = await callAPI(url, req1);
      let currentConversation = res ? res._id : null;
      console.log("Current conversation:", currentConversation);
  
      // If the conversation does not exist, create a new one
      if (!currentConversation) {
        const req2 = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString()
        };
  
        res = await callAPI(url, req2);
        currentConversation = res ? res._id : null;
        console.log("New conversation created:", currentConversation);
      }
  
      if (currentConversation) {
        dispatch(FetchCurrentMessages({ conversationId: currentConversation }));
      }
      dispatch(FetchConversations());
      setSearchTerm('');
      setSearchResults('')
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
      console.error('Error creating document:', error);
      return null;
    }
  }
  // conversationsList.sort((a, b) => b.latestMessage.sentTime - a.latestMessage.sentTime);
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
          <Stack alignItems={"center"} justifyContent="space-between" direction="row">
            <Typography variant="h5">Chats</Typography>
            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton onClick={handleOpenDialog} sx={{ width: "max-content" }}>
                <Users />
              </IconButton>
              <IconButton sx={{ width: "max-content" }}>
                <CircleDashed />
              </IconButton>
            </Stack>
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
          <Stack spacing={1}>
            <Stack direction={"row"} spacing={1.5} alignItems="center">
              <ArchiveBox size={24} />
              <Button variant="text">Archive</Button>
            </Stack>
            <Divider />
          </Stack>
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
                        displayName={user._id === user_id ? 'Bạn' : user.displayName}
                        onClick={() => handleSearchResultClick(user._id)}
                      />
                    ))}
                  </>
                )}
                <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                  All Chats
                </Typography>
                {conversationsList.map((conversation, idx) => (
                  <ChatElement
                    key={idx}
                    {...conversation}
                    displayName={conversation.members[0].displayName}
                    msg={user_id === conversation.latestMessage?.sender ? `Bạn: ${conversation.latestMessage?.content}` : conversation.latestMessage?.content||'No message'}
                    time={conversation.latestMessage!==null?formatTime(conversation.latestMessage?.sentTime) || formatTime(conversation.lastActive):''}
                    id={conversation._id}
                    onClick={() => {
                      dispatch(FetchCurrentMessages({ conversationId: conversation._id }));
                    }}
                  />
                ))}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
      {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
};

export default Chats;
