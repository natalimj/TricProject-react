import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ComponentState {
    questionComponentValue: boolean;
    userJoinedValue: boolean;
    userVotedValue: number;
    finalResultShowed: boolean;
}

const initialState: ComponentState = {
    questionComponentValue: false,
    userJoinedValue: false,
    userVotedValue: -1,
    finalResultShowed: false,
};

export const componentSlice = createSlice({
    name: 'component',
    initialState,
    reducers: {
        setQuestionComponent: (state: ComponentState, action: PayloadAction<boolean>) => {
            state.questionComponentValue = action.payload;
        },
        setUserJoined: (state: ComponentState, action: PayloadAction<boolean>) => {
            state.userJoinedValue = action.payload;
        },
        setUserVoted: (state: ComponentState, action: PayloadAction<number>) => {
            state.userVotedValue = action.payload;
        },
        setFinalResultShowed: (state: ComponentState, action: PayloadAction<boolean>) => {
            state.finalResultShowed = action.payload;
        },
        clearComponentState: (state: ComponentState) => {
            state = { ...initialState };
            return state;
        },
    },
});

export const { setQuestionComponent, setUserJoined, setUserVoted, clearComponentState, setFinalResultShowed } = componentSlice.actions;

export default componentSlice.reducer;
