import axios from '../api/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
  const {setAuth} = useAuth()
  
  const refresh = async () => {
    const response = await axios.get('/refresh',{
      withCredentials:true
    })
    setAuth(prev => {
      console.log('Previous State:',JSON.stringify(prev))
      console.log('Current State:',response.data.accessToken)
      return({
        ...prev,
	roles:response.data.roles,
        accessToken:response.data.accessToken 
      })	
    })
    return response.data.accessToken
  }

  return refresh
}

export default useRefreshToken
