import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IQuestionData from '../models/Question';

/**
 * Redux Toolkit slice contains initial state of IQuestionData
 * and reducers to change the current IQuestionData state and return its updated version
 *
 * @ Daria-Maria Popa
 */
const initialState: IQuestionData = {
    questionId: '',
    questionNumber: -1,
    questionText: '',
    answers: [],
    time: 0,
    theme: "",
};

export const questionSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        addQuestion: (state: IQuestionData, action: PayloadAction<IQuestionData>) => {
            state = { ...action.payload };
            return state;
        },
        clearQuestion: (state: IQuestionData) => {
            state = { ...initialState };
            return state;
        }
    },
});

export const { addQuestion, clearQuestion } = questionSlice.actions;

export default questionSlice.reducer;
