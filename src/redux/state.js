import { createSlice} from "@reduxjs/toolkit"

const initialState = {
	user_id: null,
	username: null,
	email: null,
  role: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user_id = action.payload.user_id;
			state.username = action.payload.username;
      state.email = action.payload.email;
			state.role = action.payload.role;
    },
    setLogout: (state) => {
      state.user_id = null;
      state.username = null;
      state.email = null;
      state.role = null;
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings
    }
  }
})

export const { setLogin, setLogout, setListings } = userSlice.actions
export default userSlice.reducer