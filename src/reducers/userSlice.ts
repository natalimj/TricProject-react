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
        addUser: (state: IUserData, action: PayloadAction<IUserData>) => {
            //if username is different than existing state add new user, otherwise it's a re-login and no state changes needed
            if (state.username !== action.payload.username){
                state.userId = action.payload.userId;
                state.username = action.payload.username;
                state.imagePath = action.payload.imagePath;
            }
        },
    },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer;
