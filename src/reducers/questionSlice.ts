import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IQuestionData from '../models/Question';

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
        emptyQuestion: (state: IQuestionData) => {
            state = { ...initialState };
            return state;
        }
    },
});

export const { addQuestion, emptyQuestion } = questionSlice.actions;

export default questionSlice.reducer;
