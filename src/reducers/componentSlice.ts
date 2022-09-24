import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface ComponentState {
    value: boolean;
}

const initialState: ComponentState = {
    value: false
};


export const componentSlice = createSlice({
    name: 'component',
    initialState,
    reducers: {
        setComponent: (state: ComponentState, action: PayloadAction<boolean>) => {
            state.value = action.payload.valueOf();
        },
    },
});

export const { setComponent } = componentSlice.actions;

export default componentSlice.reducer;
