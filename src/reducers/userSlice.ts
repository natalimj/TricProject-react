import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUserData from '../models/User';

const initialState: IUserData = {
    userId: '',
    username: '',
    imagePath: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state: IUserData, action: PayloadAction<IUserData>) => {
            state = { ...action.payload };
            return state;
        },
        logoutUser: (state: IUserData) => {
            state = { ...initialState };
            return state;
        },
    },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
