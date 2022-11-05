import statusReducer, {
    setStatus, StatusData
} from './statusSlice';
import { describe, it, expect } from '@jest/globals'

describe('status reducer', () => {
    const initialState: StatusData = {
        isActive: true
    };

    it('should handle initial state', () => {
        expect(statusReducer(undefined, { type: 'unknown' })).toEqual({
            isActive: false
        });
    });

    it('should handle delete question', () => {
        const actual = statusReducer(initialState, setStatus(false));
        expect(actual.isActive).toEqual(false);
    });
});
