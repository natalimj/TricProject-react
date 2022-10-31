import { createSlice} from '@reduxjs/toolkit';
import IAnswerData from '../models/Answer';
import IQuestionData from '../models/Question';

export interface UserResultItem {
    question : IQuestionData
    answer : IAnswerData
}

export interface UserResult {
    results :UserResultItem[]
}

const initialState: UserResult = {
    results :[]
};

export const userResultSlice = createSlice({
    name: 'userResults',
    initialState,
    reducers: {
        setUserResults: (state: UserResult  , action) => {
            state.results = [...state.results, action.payload];
        },
        removeUserResults: (state: UserResult ) => {
            state.results =[]
        },
    }
});

export const { setUserResults, removeUserResults } = userResultSlice.actions;

export default userResultSlice.reducer;
