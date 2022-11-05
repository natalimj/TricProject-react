import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IAnswerData from '../models/Answer';

const initialState: IAnswerData = {
    answerId: '',
    answerText: '',
    firstCategory: '',
    secondCategory: ''
};

export const answerSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        addAnswer: (state: IAnswerData, action: PayloadAction<IAnswerData>) => {
            state = { ...action.payload };
            return state;
        },
        removeAnswer: (state: IAnswerData) => {
            state = { ...initialState };
            return state;
        },
    },
});

export const { addAnswer, removeAnswer } = answerSlice.actions;

export default answerSlice.reducer;
