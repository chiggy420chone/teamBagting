import {useLocation,Navigate,Outlet} from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = ({allowedRoles}) => {
  const {auth} = useAuth()
  const location = useLocation()

  console.log('--',auth.roles)
  console.log('++',auth.username)

  return(
    auth?.roles?.find(role => allowedRoles?.includes(role))
      ? <Outlet />
      : auth?.username
        ? <Navigate to="/unauthorized" state={{from:location}} replace />
        : <Navigate to="/auth" state={{from:location}} replace />
  )
}

export default RequireAuth
