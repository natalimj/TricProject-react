import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AdminState, logoutAdmin } from '../reducers/adminSlice';

export const isAuth = (dispatch, admin: AdminState) => {
  if (!admin.id) {
    return false;
  }
  const decodedToken: JwtPayload = jwt_decode<JwtPayload>(admin.accessToken);
  if (!decodedToken.exp) {
    return false;
  }
  const currentDate = new Date();
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    dispatch(logoutAdmin());
    return false;
  }
  return true;
}