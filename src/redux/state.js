import { createSlice} from "@reduxjs/toolkit"

const initialState = {
	user_id: null,
	username: null,
	email: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user_id = action.payload.user_id;
			state.username = action.payload.username;
			state.email = action.payload.email;
    },
    setLogout: (state) => {
    state.user_id = null;
		state.username = null;
		state.email = null;
    },
    setListings: (state, action) => {
      state.listings = action.payload.listings
    },
    setTripList: (state, action) => {
      state.user.tripList = action.payload
    },
    setWishList: (state, action) => {
      state.user.wishList = action.payload
    },
    setPropertyList: (state, action) => {
      state.user.propertyList = action.payload
    },
    setReservationList: (state, action) => {
      state.user.reservationList = action.payload
    }
  }
})

export const { setLogin, setLogout, setListings, setTripList, setWishList, setPropertyList, setReservationList } = userSlice.actions
export default userSlice.reducer