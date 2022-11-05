import adminReducer, {
    AdminState,
    logAdmin,
    logoutAdmin
} from './adminSlice';
import { describe, it, expect } from '@jest/globals'

describe('admin reducer', () => {
    const initialState: AdminState = {
        accessToken: 'something',
        email: 'email@email.com',
        roles: ['role1'],
        tokenType: 'token2',
        username: 'admin2'
    };

    it('should handle initial state', () => {
        expect(adminReducer(undefined, { type: 'unknown' })).toEqual({
            accessToken: '',
            email: '',
            roles: [],
            tokenType: '',
            username: ''
        });
    });

    it('should login admin', () => {
        const actual = adminReducer(initialState, logAdmin({
            accessToken: 'token',
            email: 'email',
            roles: ['role1', 'role2'],
            tokenType: 'this',
            username: 'admin'
        }));
        expect(actual).toEqual({
            accessToken: 'token',
            email: 'email',
            roles: ['role1', 'role2'],
            tokenType: 'this',
            username: 'admin'
        });
    });

    it('should logout admin', () => {
        const actual = adminReducer(initialState, logoutAdmin());
        expect(actual).toEqual({
            accessToken: '',
            email: '',
            roles: [],
            tokenType: '',
            username: ''
        });
    });
});
