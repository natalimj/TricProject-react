import userReducer, {
    loginUser, logoutUser
} from '../../reducers/userSlice';
import { describe, it, expect } from '@jest/globals'
import IUserData from '../../models/User';

describe('status reducer', () => {
    const initialState: IUserData = {
        userId: 32,
        username: 'someone',
        imagePath: 'image.png',
    };

    it('should handle initial state', () => {
        expect(userReducer(undefined, { type: 'unknown' })).toEqual({
            userId: '',
            username: '',
            imagePath: '',
        });
    });

    it('should handle add user', () => {
        const actual = userReducer(initialState, loginUser({
            userId: 224,
            username: 'john',
            imagePath: 'john.png',
        }));
        expect(actual).toEqual({
            userId: 224,
            username: 'john',
            imagePath: 'john.png',
        });
    });

    it('should handle remove user', () => {
        const actual = userReducer(initialState, logoutUser());
        expect(actual).toEqual({
            userId: '',
            username: '',
            imagePath: '',
        });
    });
});
