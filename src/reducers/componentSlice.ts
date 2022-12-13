import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Redux Toolkit slice contains ComponentState interface, initial state of ComponentState
 * and reducers to change the current ComponentState state and return its updated version
 *
 * @ Daria-Maria Popa
 */
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
