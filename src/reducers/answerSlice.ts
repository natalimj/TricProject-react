import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IAnswerData from '../models/Answer';

/**
 * Redux Toolkit slice contains initial state of IAnswerData
 * and reducers to change the current IAnswerData state and return its updated version
 *
 * @ Daria-Maria Popa
 */
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
        clearAnswer: (state: IAnswerData) => {
            state = { ...initialState };
            return state;
        },
    },
});

export const { addAnswer, clearAnswer } = answerSlice.actions;

export default answerSlice.reducer;
