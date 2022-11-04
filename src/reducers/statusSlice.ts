import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StatusData {
    isActive: boolean
}

const initialState: StatusData = {
    isActive: false
};

export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        setStatus: (state: StatusData, action: PayloadAction<boolean>) => {
            state.isActive = action.payload;
        },
    },
});

export const { setStatus } = statusSlice.actions;

export default statusSlice.reducer;