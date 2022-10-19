import { Navigate, Outlet } from 'react-router-dom'
import { isAuth } from '../services/auth.service'
import { useAppDispatch, useAppSelector } from '../app/hooks';

const PrivateRoutes = () => {
  const dispatch = useAppDispatch();
  const auth = isAuth(dispatch, useAppSelector);
  
  return (
    auth ? <Outlet /> : <Navigate to='/login' />
  )
}

export default PrivateRoutes
