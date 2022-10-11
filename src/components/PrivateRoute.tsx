import { Navigate, Outlet } from 'react-router-dom'
import { isAuth } from '../services/auth.service'

const PrivateRoutes = () => {
  let auth = isAuth()
return (
    auth ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes
