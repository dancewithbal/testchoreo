import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../../../dao/state/state.dao";

const initialState: UserState = {
    loggedIn: false,
    email: "",
    givenName: "",
    familyName: "",
    fullName: "",
    picture: "",
    id: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loggedIn(state, action: PayloadAction<UserState>) {
            //here with latest redux, you can write like it is mutating, redux internally make it pure and do the required cloning using immer
            // state = action.payload
            const {loggedIn, email, givenName, familyName, fullName, picture, id} = action.payload;
            state.loggedIn = loggedIn;
            state.email = email;
            state.givenName = givenName;
            state.familyName = familyName;
            state.fullName = fullName;
            state.id = id;
            state.picture = picture;
        },
        loggedOut(state) {
            state.loggedIn = false;
            state.email = "";
            state.givenName = "";
            state.familyName = "";
            state.fullName = "";
            state.id = "";
            state.picture = "";
        },
    },
})

export const { loggedIn, loggedOut } = userSlice.actions; 
export default userSlice.reducer;