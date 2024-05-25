import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
  conversationsList: [],
  currentConversationId: null,
  current_messages:[],
  isFirstLogin:true,
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state, action) {
      state.conversationsList = action.payload.conversations.map(conv => ({
        ...conv,
        currentIdx: conv.length, // Khởi tạo currentIdx bằng với độ dài của cuộc hội thoại
        latestMessage: conv.latestMessage || null, // Lưu tin nhắn mới nhất vào cuộc hội thoại
      }));
    },
    updateConversation(state, action) {
      // Code for updating a conversation if needed
    },
    addConversation(state, action) {
      // Code for adding a conversation if needed
    },
    setCurrentConversation(state, action) {
      state.currentConversationId = action.payload.conversationId;
    },
    fetchCurrentMessages(state, action) {
      state.current_messages = action.payload.messages;
      state.isFirstLogin=false;
    },
    addMessage(state, action) {
      state.current_messages.push(action.payload.message);
    },
    setLatestMessage(state, action) {
      const { message } = action.payload;
      const conversationId = message.conversation;
      const conversation = state.conversationsList.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        conversation.latestMessage = {
          ...message,
          sentTime: message.sentTime,
          sender:message.sender,
        };
      }
    },
  },
});


// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchConversations = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get('/login', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'userid': user_id,
        },
      });

      const { conversations } = response.data.user;

      for (let conversation of conversations) {
        const convId = conversation._id;
        const initialIdx = conversation.length+1; // Khởi tạo currentIdx bằng với độ dài tin nhắn

        try {
          const messageResponse = await axios.get('/message', {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'convid': convId,
              'idx': initialIdx, // Lấy tin nhắn mới nhất
              'length': conversation.length>10?10:conversation.length,
            },
          });

          const messages = messageResponse.data.messages.messages;
          if (messages && messages.length > 0) {
            const latestMessage = messages[messages.length-1]; // Lấy tin nhắn mới nhất
            conversation.latestMessage = latestMessage;
          }else{
            conversation.latestMessage=null;
          }
        } catch (error) {
          console.error("Error fetching latest message:", error);
        }
      }

      dispatch(slice.actions.fetchConversations({ conversations }));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
};



export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addConversation({ conversation }));
  };
};

export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateConversation({ conversation }));
  };
};

export const SetCurrentConversation = (conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation({ conversation }));
  };
};

export const FetchCurrentMessages = (conversationId) => {
  console.log(conversationId.conversationId)
  return async (dispatch, getState) => {
    const { conversationsList } = getState().conversation;
    dispatch(slice.actions.setCurrentConversation(conversationId));
    console.log(conversationsList)

    const currentConversation = conversationsList.find(
      (conversation) => conversation._id === conversationId.conversationId
    );

    console.log(currentConversation);

    if (!currentConversation) {
      console.error("Conversation not found:", conversationId);
      return;
    }
  
    const currentIdx = currentConversation.length+1;
    console.log("curIDx:",currentIdx)

    try {
      const response = await axios.get('/message', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'convid': currentConversation._id,
          'idx': currentIdx,
          'length': currentConversation.length>10?10:currentConversation.length,
        },
      });

      console.log(response);
      dispatch(slice.actions.fetchCurrentMessages({ messages: response.data.messages.messages }));

    } catch (error) {
      console.error("Error fetching messages:", error);
      dispatch(slice.actions.fetchCurrentMessages({ messages: []}));

    }
  };
};

export const SetLatestMessage = (message) => {
  return async (dispatch, getState) => {
    console.log(message.message)
    dispatch(slice.actions.setLatestMessage({message:message.message}))
  };
};

export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    console.log(message.message)
    dispatch(slice.actions.addMessage( {message:message.message} ));
  };
};
export const SendMessage = ({conversation,sender,receiver,sentTime,content}) => {
  return async (dispatch, getState) => {
    try {
      const urlEncodedData = new URLSearchParams({
        conversation:conversation,
        sender:sender,
        receiver:receiver,
        sentTime:sentTime,
        content:content
      });

      const response = await axios.post('/message', urlEncodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
};
