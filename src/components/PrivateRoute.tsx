import { Navigate, Outlet } from 'react-router-dom'
import { isAuth } from '../services/auth.service'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

const PrivateRoutes = () => {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state: RootState) => state.admin);
  const auth = isAuth(dispatch, admin);
  
  return (
    auth ? <Outlet /> : <Navigate to='/login' />
  )
}

export default PrivateRoutes
