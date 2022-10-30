import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IQuestionData from '../models/Question';

const initialState: IQuestionData = {
    questionId: '',
    questionNumber: -1,
    questionText: '',
    answers: [],
    time:0,
    theme: "",
};

export const questionSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        addQuestion: (state: IQuestionData, action: PayloadAction<IQuestionData>) => {
            console.log("getting question data")
            state.questionId = action.payload.questionId;
            state.questionNumber = action.payload.questionNumber;
            state.questionText = action.payload.questionText;
            state.answers = [...action.payload.answers];
            state.time = action.payload.time;
            state.theme = action.payload.theme;
        },
        emptyQuestion: (state: IQuestionData) => {
            console.log("empty question data")
            state.questionId = '';
            state.questionNumber = -1;
            state.questionText = '';
            state.answers = [];
            state.time = 0;
        }
    },
});

export const { addQuestion, emptyQuestion } = questionSlice.actions;

export default questionSlice.reducer;
