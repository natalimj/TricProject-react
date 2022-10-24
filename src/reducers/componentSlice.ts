import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ComponentState {
    questionComponentValue: boolean;
    userJoinedValue: boolean;
    userVotedValue: number;
}

const initialState: ComponentState = {
    questionComponentValue: false,
    userJoinedValue: false,
    userVotedValue: -1,
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
    },
});

export const { setQuestionComponent, setUserJoined, setUserVoted } = componentSlice.actions;

export default componentSlice.reducer;
