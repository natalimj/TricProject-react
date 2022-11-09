import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayData {
    numberOfUsers: number;
    numberOfQuestions: number;
    showQuestionButton: boolean;
    questionTimer: number;
}

const initialState: PlayData = {
    numberOfUsers: 0,
    numberOfQuestions: 0,
    showQuestionButton: true,
    questionTimer: -1
};

export const playDataSlice = createSlice({
    name: 'playData',
    initialState,
    reducers: {
        setNumberOfUsers: (state: PlayData, action: PayloadAction<number>) => {
            state.numberOfUsers = action.payload;
        },
        setNumberOfQuestions: (state: PlayData, action: PayloadAction<number>) => {
            state.numberOfQuestions = action.payload;
        },
        setShowQuestionButton: (state: PlayData, action: PayloadAction<boolean>) => {
            state.showQuestionButton = action.payload;
        },
        setQuestionTimer: (state: PlayData, action: PayloadAction<number>) => {
            state.questionTimer = action.payload;
        },
        clearPlayData: (state: PlayData) => {
            state = { ...initialState };
            return state;
        }
    },
});

export const { setNumberOfUsers, setNumberOfQuestions, setShowQuestionButton, setQuestionTimer, clearPlayData } = playDataSlice.actions;

export default playDataSlice.reducer;
