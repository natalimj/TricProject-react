import answerReducer, {
    addAnswer
} from './answerSlice';
import { describe, it, expect } from '@jest/globals'
import IAnswerData from '../models/Answer';

describe('admin reducer', () => {
    const initialState: IAnswerData = {
        answerId: '234',
        answerText: 'No',
        category: 'Conservative',
    };

    it('should handle initial state', () => {
        expect(answerReducer(undefined, { type: 'unknown' })).toEqual({
            answerId: '',
            answerText: '',
            category: '',
        });
    });

    it('should handle increment', () => {
        const actual = answerReducer(initialState, addAnswer({
            answerId: '1',
            answerText: 'Yes',
            category: 'Pragmatic',
        }));
        expect(actual).toEqual({
            answerId: '1',
            answerText: 'Yes',
            category: 'Pragmatic',
        });
    });
});
