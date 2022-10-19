import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminState {
    accessToken: string,
    email:string,
    id?: number,
    roles : string[],
    tokenType : string,
    username : string
}

const initialState: AdminState = {
    accessToken: '',
    email:'',
    roles : [],
    tokenType : '',
    username : ''
};


export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        logAdmin: (state: AdminState, action: PayloadAction<AdminState>) => {
            state.accessToken = action.payload.accessToken;
            state.email = action.payload.email;
            state.id = action.payload.id;
            state.roles = action.payload.roles;
            state.tokenType = action.payload.tokenType;
            state.username = action.payload.username;
        },
        logoutAdmin: (state: AdminState) => {
            state.accessToken = '';
            state.email = '';
            state.id = undefined;
            state.roles = [];
            state.tokenType = '';
            state.username = '';
        },
    },
});

export const { logAdmin, logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;