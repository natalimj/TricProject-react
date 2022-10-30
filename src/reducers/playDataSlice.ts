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
    questionTimer: 0
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
        }
    },
});

export const { setNumberOfUsers, setNumberOfQuestions, setShowQuestionButton, setQuestionTimer } = playDataSlice.actions;

export default playDataSlice.reducer;
