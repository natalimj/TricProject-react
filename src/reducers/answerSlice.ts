import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IAnswerData from '../models/Answer';

const initialState: IAnswerData = {
    answerId: '',
    answerText: '',
    category :'',
};

export const answerSlice = createSlice({
    name: 'answer',
    initialState,
    reducers: {
        addAnswer: (state: IAnswerData, action: PayloadAction<IAnswerData>) => {
            state.answerId = action.payload.answerId;
            state.answerText = action.payload.answerText;
            state.category =action.payload.category;
        },
    },
});

export const { addAnswer } = answerSlice.actions;

export default answerSlice.reducer;
