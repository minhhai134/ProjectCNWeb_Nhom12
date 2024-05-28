import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { socket } from "../../socket";
const user_id = window.localStorage.getItem("user_id");

const initialState = {
  conversationsList: [],
  pendingConversationsList: [],
  currentConversationId: null,
  current_messages: [],
  isFirstLogin: true,
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchConversations(state, action) {
      const { conversations, conversationStatus } = action.payload;

      state.conversationsList = conversations.filter(conv =>
        conversationStatus.some(status =>
          status.convID === conv._id && status.status === 'accept'
        )
      ).map(conv => ({
        ...conv,
        currentIdx: conv.length,
        latestMessage: conv.latestMessage || null,
      }));
      
      state.pendingConversationsList = conversations.filter(conv =>
        conversationStatus.some(status =>
          status.convID === conv._id && status.status === 'pending'
        )
      ).map(conv => ({
        ...conv,
        currentIdx: conv.length,
        latestMessage: conv.latestMessage || null,
      }));
    },
    setCurrentConversation(state, action) {
      state.currentConversationId = action.payload.conversationId;
    },
    fetchCurrentMessages(state, action) {
      state.current_messages = action.payload.messages;
      state.isFirstLogin = false;
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
          sender: message.sender,
        };
      }

      const pendingConversation = state.pendingConversationsList.find(
        (conv) => conv._id === conversationId
      );
      if (pendingConversation) {
        pendingConversation.latestMessage = {
          ...message,
          sentTime: message.sentTime,
          sender: message.sender,
        };
      }
    },
    updateBlockStatus(state, action) {
      const { conversationId, blockStatus } = action.payload;
      const conversation = state.conversationsList.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        conversation.blockStatus = blockStatus;
      }
      const pendingConversation = state.pendingConversationsList.find(
        (conv) => conv._id === conversationId
      );
      if (pendingConversation) {
        pendingConversation.blockStatus = blockStatus;
      }
    },
    updateConversationStatus(state, action) {
      const { conversationId, status } = action.payload;
      if (status === 'accept') {
        const index = state.pendingConversationsList.findIndex(conv => conv._id === conversationId);
        if (index !== -1) {
          const [conversation] = state.pendingConversationsList.splice(index, 1);
          state.conversationsList.push(conversation);
        }
      } else if (status === 'pending') {
        const index = state.conversationsList.findIndex(conv => conv._id === conversationId);
        if (index !== -1) {
          const [conversation] = state.conversationsList.splice(index, 1);
          state.pendingConversationsList.push(conversation);
        }
      }
    },
    resetState: () => initialState,
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchConversations = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/login', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'userid': user_id,
        },
      });

      console.log("data:",response)
      const { conversations, conversationStatus } = response.data.user;

      for (let conversation of conversations) {
        const convId = conversation._id;
        const initialIdx = conversation.length + 1;
        console.log(initialIdx)
        try {
          const messageResponse = await axios.get('/message', {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'convid': convId,
              'idx': initialIdx,
              'length': conversation.length > 10 ? 10 : conversation.length,
            },
          });

          const messages = messageResponse.data.messages.messages || [];
          if (messages && messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            conversation.latestMessage = latestMessage;
          } else {
            conversation.latestMessage = null;
          }
        } catch (error) {
          console.error("Error fetching latest message:", error);
        }
      }

      dispatch(slice.actions.fetchConversations({ conversations, conversationStatus }));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
};

export const SetCurrentConversation = (conversationId) => {
  return async (dispatch) => {
    dispatch(slice.actions.setCurrentConversation({ conversationId }));
  };
};

export const FetchCurrentMessages = (conversationId) => {
  return async (dispatch, getState) => {
    const { conversationsList, pendingConversationsList } = getState().conversation;
    dispatch(slice.actions.setCurrentConversation({ conversationId }));

    const currentConversation = conversationsList.find(
      (conversation) => conversation._id === conversationId.conversationId
    ) || pendingConversationsList.find(
      (conversation) => conversation._id === conversationId.conversationId
    );

      console.log('currentConv:',currentConversation)

    if (!currentConversation) {
      console.error("Conversation not found:", conversationId);
      return;
    }

    const currentIdx = currentConversation.length + 1;

    try {
      const response = await axios.get('/message', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'convid': currentConversation._id,
          'idx': currentIdx,
          'length': currentConversation.length > 10 ? 10 : currentConversation.length,
        },
      });

      dispatch(slice.actions.fetchCurrentMessages({ messages: response.data.messages.messages }));

    } catch (error) {
      console.error("Error fetching messages:", error);
      dispatch(slice.actions.fetchCurrentMessages({ messages: [] }));
    }
  };
};

export const SetLatestMessage = (message) => {
  return async (dispatch) => {
    dispatch(slice.actions.setLatestMessage({ message:message.message }));
  };
};

export const AddDirectMessage = (message) => {
  return async (dispatch) => {
    dispatch(slice.actions.addMessage({ message:message.message }));
  };
};

export const SendMessage = ({ conversation, sender, receiver, sentTime, content }) => {
  return async (dispatch) => {
    try {
      const urlEncodedData = new URLSearchParams({
        conversation: conversation,
        sender: sender,
        receiver: receiver,
        sentTime: sentTime,
        content: content,
      });

      const response = await axios.post('/message', urlEncodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log("sendMess:",response);
    } catch (error) {
      console.log(error);
    }
  };
};

export const UpdateBlockStatus = (conversationId, status) => {
  return async (dispatch, getState) => {
    try {
      const { conversationsList, pendingConversationsList } = getState().conversation;
      
      // Tìm ID của người nhận trong cuộc hội thoại
      const getReceiverId = (convId) => {
        const conversation = conversationsList.find(conv => conv._id === convId);
        if (conversation) {
          return conversation.members.find(member => member._id !== user_id)._id;
        }
        const pendingConversation = pendingConversationsList.find(conv => conv._id === convId);
        return pendingConversation ? pendingConversation.members.find(member => member._id !== user_id)._id : null;
      };

      const receiverId = getReceiverId(conversationId);
      if (!receiverId) {
        console.error("Receiver not found for conversation:", conversationId);
        return;
      }

      const blockObj = {
        user1: user_id,
        user2: receiverId,
        conv: conversationId,
      };

      // Cập nhật trạng thái block trong Redux
      dispatch(slice.actions.updateBlockStatus({ conversationId, blockStatus: status }));

      // Gửi sự kiện block/unblock thông qua socket
      if (status === user_id) {
        socket.emit("blockUser", blockObj);
      } else if (status === '') {
        socket.emit("unblockUser", blockObj);
      }

      // Cập nhật trạng thái block trên máy chủ
      const body = new URLSearchParams({
        convID: conversationId,
        blockStatus: status,
      });

      const response = await axios.post('/blockstatus', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status !== 200) {
        console.error('Failed to update block status on server', response.statusText);
      }

    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };
};


export const UpdateConversationStatus = (conversationId, status) => {
  return async (dispatch) => {
    try {
      const body = new URLSearchParams({
        userID: user_id,
        convID: conversationId,
        status: status,
      });

      const response = await axios.post('/conversationstatus', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        dispatch(slice.actions.updateConversationStatus({ conversationId, status }));
        console.log('updateConvStt',response)
      } else {
        console.error('Failed to update conversation status', response.statusText);
      }
    } catch (error) {
      console.error('Error updating conversation status:', error);
    }
  };
};

export function LogoutUserConv() {
  return async (dispatch) => {
    dispatch(slice.actions.resetState());
  };
}
