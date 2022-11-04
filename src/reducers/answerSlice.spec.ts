import answerReducer, {
    addAnswer
} from './answerSlice';
import { describe, it, expect } from '@jest/globals'
import IAnswerData from '../models/Answer';

describe('answer reducer', () => {
    const initialState: IAnswerData = {
        answerId: '234',
        answerText: 'No',
        firstCategory: 'Conservative',
        secondCategory: 'Pragmatic'
    };

    it('should handle initial state', () => {
        expect(answerReducer(undefined, { type: 'unknown' })).toEqual({
            answerId: '',
            answerText: '',
            firstCategory: '',
            secondCategory: ''
        });
    });

    it('should handle adding answer data', () => {
        const actual = answerReducer(initialState, addAnswer({
            answerId: '1',
            answerText: 'Yes',
            firstCategory: 'Progressive',
            secondCategory: 'Idealist'
        }));
        expect(actual).toEqual({
            answerId: '1',
            answerText: 'Yes',
            firstCategory: 'Progressive',
            secondCategory: 'Idealist'
        });
    });
});
