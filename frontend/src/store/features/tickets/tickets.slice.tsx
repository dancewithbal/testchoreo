import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TicketState } from "../../../dao/state/state.dao";

const initialState: TicketState[] = [];

const ticketSlice = createSlice({
    name: "ticket",
    initialState,
    reducers: {
        addedTicket(state, action: PayloadAction<TicketState>) {
            //here with latest redux, you can write like it is mutating, redux internally make it pure and do the required cloning using immer
            // state = action.payload
            state.push(action.payload);
        },
        addedTickets(state, action: PayloadAction<TicketState[]>) {
            action.payload.map((t) => {
                const index = state.findIndex((ti) => ti.ticketId == t.ticketId);
                if (index === -1) {
                    state.push(t);
                }
            })
        },
        removedTicket(state, action: PayloadAction<string>) {
            const index = state.findIndex((t) => t.ticketId == action.payload);
            if (index > -1) {
                state.splice(index, 1);
            }
        }
    },
})

export const { addedTicket, addedTickets, removedTicket } = ticketSlice.actions;
export default ticketSlice.reducer;