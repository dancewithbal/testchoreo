import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/user.slice';
import ticketsReducer from './features/tickets/tickets.slice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        tickets: ticketsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
