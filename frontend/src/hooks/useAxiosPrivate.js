import {axiosPrivate} from '../api/axios'
import {useState,useEffect} from "react"
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'

const useAxiosPrivate = () => {
  const [token,setToken] = useState('')
  const refresh = useRefreshToken()
  const {auth} = useAuth()

  useEffect(() => {
    const requestIntercept = 
    axiosPrivate.interceptors.request
    .use(
      async config => {
        if(!config.headers['Authorization']){
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
	}
	console.log('Header Authorization:',auth?.accessToken)    
	return config
      },(error) => Promise.reject(error)
    )

    const responseIntercept = 
    axiosPrivate.interceptors.response
    .use(
      response => {
	setToken(auth?.accessToken)
	console.log('Response:',response)     
        return(response)
      },
      async (error) => {
        const prevRequest = error?.config
	if(error?.response?.status === 403 && !prevRequest?.sent){
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosPrivate(prevRequest)
	}
	return Promise.reject(error )
      }
    )
    console.log('Token:',token)
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  },[auth,refresh,token])

  return axiosPrivate
} 

export default useAxiosPrivate
