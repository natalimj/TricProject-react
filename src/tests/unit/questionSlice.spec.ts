import questionReducer, {
    addQuestion,
    emptyQuestion
} from '../../reducers/questionSlice';
import { describe, it, expect } from '@jest/globals'
import IQuestionData from '../../models/Question';

describe('question reducer', () => {
    const initialState: IQuestionData = {
        questionId: '',
        questionNumber: -1,
        questionText: '',
        answers: [],
        time: 0,
        theme: "",
    };

    it('should handle initial state', () => {
        expect(questionReducer(undefined, { type: 'unknown' })).toEqual({
            questionId: '',
            questionNumber: -1,
            questionText: '',
            answers: [],
            time: 0,
            theme: "",
        });
    });

    it('should handle add question', () => {
        const actual = questionReducer(initialState, addQuestion({
            questionId: '24',
            questionNumber: 3,
            questionText: 'How are you?',
            answers: [{
                answerId: '1',
                answerText: 'Yes',
                firstCategory: 'Pragmatic',
                secondCategory: 'Conservative'
            }, {
                answerId: '2',
                answerText: 'No',
                firstCategory: 'Idealist',
                secondCategory: 'Progressive'
            }],
            time: 30,
            theme: "Climate change",
        }));
        expect(actual).toEqual({
            questionId: '24',
            questionNumber: 3,
            questionText: 'How are you?',
            answers: [{
                answerId: '1',
                answerText: 'Yes',
                firstCategory: 'Pragmatic',
                secondCategory: 'Conservative'
            }, {
                answerId: '2',
                answerText: 'No',
                firstCategory: 'Idealist',
                secondCategory: 'Progressive'
            }],
            time: 30,
            theme: "Climate change",
        });
    });

    it('should handle delete question', () => {
        const actual = questionReducer(initialState, emptyQuestion());
        expect(actual).toEqual({
            questionId: '',
            questionNumber: -1,
            questionText: '',
            answers: [],
            time: 0,
            theme: "",
        });
    });
});
