import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Redux Toolkit slice contains AdminState interface, initial state of AdminState
 * and reducers to change the current AdminState state and return its updated version
 *
 * @ Daria-Maria Popa
 */
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
        loginAdmin: (state: AdminState, action: PayloadAction<AdminState>) => {
            state = { ...action.payload };
            return state;
        },
        logoutAdmin: (state: AdminState) => {
            state = { ...initialState };
            return state;
        },
    },
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;