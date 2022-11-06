import componentReducer, {
    setQuestionComponent,
    setUserJoined,
    setUserVoted,
    setFinalResultShowed,
    clearComponentState,
    ComponentState
} from '../../reducers/componentSlice';
import { describe, it, expect } from '@jest/globals'

describe('component reducer', () => {
    const initialState: ComponentState = {
        questionComponentValue: true,
        userJoinedValue: true,
        userVotedValue: 3,
        finalResultShowed: true
    };

    it('should handle initial state', () => {
        expect(componentReducer(undefined, { type: 'unknown' })).toEqual({
            questionComponentValue: false,
            userJoinedValue: false,
            userVotedValue: -1,
            finalResultShowed: false
        });
    });

    it('should handle set questionComponent', () => {
        const actual = componentReducer(initialState, setQuestionComponent(true));
        expect(actual.questionComponentValue).toEqual(true);
    });

    it('should handle set userJoined', () => {
        const actual = componentReducer(initialState, setUserJoined(true));
        expect(actual.userJoinedValue).toEqual(true);
    });

    it('should handle set userVoted', () => {
        const actual = componentReducer(initialState, setUserVoted(2));
        expect(actual.userVotedValue).toEqual(2);
    });

    it('should handle set finalResultShowed', () => {
        const actual = componentReducer(initialState, setFinalResultShowed(true));
        expect(actual.finalResultShowed).toEqual(true);
    });

    it('should handle clearing component state', () => {
        const actual = componentReducer(initialState, clearComponentState());
        expect(actual).toEqual({
            questionComponentValue: false,
            userJoinedValue: false,
            userVotedValue: -1,
            finalResultShowed: false
        });
    });
});
