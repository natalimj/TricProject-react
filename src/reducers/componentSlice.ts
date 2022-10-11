import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ComponentState {
    questionComponentValue: boolean;
    userSubmittedValue: boolean;
}

const initialState: ComponentState = {
    questionComponentValue: false,
    userSubmittedValue: false,
};

export const componentSlice = createSlice({
    name: 'component',
    initialState,
    reducers: {
        setQuestionComponent: (state: ComponentState, action: PayloadAction<boolean>) => {
            state.questionComponentValue = action.payload;
        },
        setUserSubmitted: (state: ComponentState, action: PayloadAction<boolean>) => {
            state.userSubmittedValue = action.payload;
        },
    },
});

export const { setQuestionComponent, setUserSubmitted } = componentSlice.actions;

export default componentSlice.reducer;
