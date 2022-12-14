/**
 * returns an object containing the JWT of the logged in user from Local Storage.
 *
 * @ author Bogdan Mezei
 */
export default function authHeader(accessToken:string) {
    if (accessToken !== '') {
        return { Authorization: 'Bearer ' + accessToken };
    } else {
        return { Authorization: '' };
    }
}