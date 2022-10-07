import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IQuestionData from '../models/Question';

const initialState: IQuestionData = {
    questionId: '',
    questionNumber: -1,
    questionText: '',
    answers: [],
    time:0
};


export const questionSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        addQuestion: (state: IQuestionData, action: PayloadAction<IQuestionData>) => {
            state.questionId = action.payload.questionId;
            state.questionNumber = action.payload.questionNumber;
            state.questionText = action.payload.questionText;
            state.answers = [...action.payload.answers];
            state.time = action.payload.time;
        },
    },
});

export const { addQuestion } = questionSlice.actions;

export default questionSlice.reducer;
