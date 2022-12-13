import { createSlice, PayloadAction } from '@reduxjs/toolkit';


/**
 * Redux Toolkit slice contains StatusData interface, initial state of StatusData
 * and reducers to change the current StatusData state and return its updated version
 *
 * @ Daria-Maria Popa
 */
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