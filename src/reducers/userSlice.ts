import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUserData from '../models/User';

/**
 * Redux Toolkit slice contains initial state of IUserData
 * and reducers to change the current IUserData state and return its updated version
 *
 * @ Daria-Maria Popa
 */
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
