import playDataReducer, {
    setNumberOfUsers,
    setNumberOfQuestions,
    setShowQuestionButton,
    setQuestionTimer,
    PlayData
} from './playDataSlice';
import { describe, it, expect } from '@jest/globals'

describe('playData reducer', () => {
    const initialState: PlayData = {
        numberOfUsers: 20,
        numberOfQuestions: 50,
        showQuestionButton: false,
        questionTimer: 50
    };

    it('should handle initial state', () => {
        expect(playDataReducer(undefined, { type: 'unknown' })).toEqual({
            numberOfUsers: 0,
            numberOfQuestions: 0,
            showQuestionButton: true,
            questionTimer: -1
        });
    });

    it('should handle set number of users', () => {
        const actual = playDataReducer(initialState, setNumberOfUsers(10));
        expect(actual.numberOfUsers).toEqual(10);
    });

    it('should handle set number of questions', () => {
        const actual = playDataReducer(initialState, setNumberOfQuestions(4));
        expect(actual.numberOfQuestions).toEqual(4);
    });

    it('should handle set show question button', () => {
        const actual = playDataReducer(initialState, setShowQuestionButton(true));
        expect(actual.showQuestionButton).toEqual(true);
    });

    it('should handle set question timer', () => {
        const actual = playDataReducer(initialState, setQuestionTimer(20));
        expect(actual.questionTimer).toEqual(20);
    });
});
