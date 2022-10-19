import jwt_decode, { JwtPayload } from 'jwt-decode';
import { RootState } from '../app/store';
import { logoutAdmin } from '../reducers/adminSlice';

export const isAuth = (dispatch, useAppSelector) => {
  const admin = useAppSelector((state: RootState) => state.admin);
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