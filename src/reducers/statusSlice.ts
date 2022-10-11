import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IStatusData from '../models/Status';

const initialState: IStatusData = {
    isActive :false
};

export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        setStatus: (state:IStatusData, action: PayloadAction<IStatusData>) => {
            state.isActive = action.payload.isActive;
        },
    },
});

export const { setStatus } = statusSlice.actions;

export default statusSlice.reducer;