import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    loggedIn: boolean;
    email: string;
}

const initialState: UserState = {
    loggedIn: false,
    email: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loggedIn(state, action: PayloadAction<string>) {
            //here with latest redux, you can write like it is mutating, redux internally make it pure and do the required cloning using immer
            state.email = action.payload; 
            state.loggedIn = true;
        },
        loggedOut(state) {
            state.email = "";
            state.loggedIn = false;
        },
    },
})

export const { loggedIn, loggedOut } = userSlice.actions; 
export default userSlice.reducer;