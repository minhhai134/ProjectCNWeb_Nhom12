import { createSlice } from "@reduxjs/toolkit";

import axios from "../../utils/axios";
import { showSnackbar } from "./app";

// ----------------------------------------------------------------------

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  user_id: null,
  username: "",
  error: false,
  displayName:"",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
      state.displayName=action.payload.displayName;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = "";
      state.user_id = null;
      state.displayName="";
    },
    updateRegisterUsername(state, action) {
      state.username = action.payload.username;
    },
  },
});

// Reducer
export default slice.reducer;

export function LoginUser(formValues) {
  console.log({
    ...formValues,
  });
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    try {
      const urlEncodedData = new URLSearchParams(formValues);

      const response = await axios.post('/login', urlEncodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log(response);
      dispatch(
        slice.actions.logIn({
          isLoggedIn: true,
          token: response.data.token,
          user_id: response.data.data._id,
          displayName:response.data.data.displayName,
        })
      );
      window.localStorage.setItem('user_id', response.data.data._id);
      dispatch(
        showSnackbar({ severity: 'success', message: response.data.status })
      );
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
    } catch (error) {
      console.log(error);
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}



export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
    dispatch(slice.actions.signOut());
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    try {
      // Chuyển đổi formValues thành x-www-form-urlencoded
      const urlEncodedData = new URLSearchParams(formValues);

      const response = await axios.post('/register', urlEncodedData);

      console.log(response);

      if (response.data.message === "username already exist") {
        dispatch(showSnackbar({ severity: 'warning', message: response.data.message }));
      } else {
        dispatch(slice.actions.updateRegisterUsername({ username: formValues.username }));
        dispatch(showSnackbar({ severity: 'success', message: 'Registration successful' }));
      }

      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      console.log(error);
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
      dispatch(slice.actions.updateIsLoading({ error: true, isLoading: false }));
    }
  };
}