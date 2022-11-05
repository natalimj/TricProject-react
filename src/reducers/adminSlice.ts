import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminState {
    accessToken: string,
    email: string,
    id?: number,
    roles: string[],
    tokenType: string,
    username: string
}

const initialState: AdminState = {
    accessToken: '',
    email: '',
    roles: [],
    tokenType: '',
    username: ''
};

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        logAdmin: (state: AdminState, action: PayloadAction<AdminState>) => {
            state = { ...action.payload };
            return state;
        },
        logoutAdmin: (state: AdminState) => {
            state = { ...initialState };
            return state;
        },
    },
});

export const { logAdmin, logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;