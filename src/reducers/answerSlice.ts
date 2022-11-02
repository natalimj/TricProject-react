import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IAnswerData from '../models/Answer';

const initialState: IAnswerData = {
    answerId: '',
    answerText: '',
    category :'',
    secondCategory :''
};

export const answerSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        addAnswer: (state: IAnswerData, action: PayloadAction<IAnswerData>) => {
            state.answerId = action.payload.answerId;
            state.answerText = action.payload.answerText;
            state.category =action.payload.category;
            state.secondCategory = action.payload.secondCategory;
        },
    },
});

export const { addAnswer } = answerSlice.actions;

export default answerSlice.reducer;
