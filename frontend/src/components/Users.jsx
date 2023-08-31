import {useState,useEffect,useRef} from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import {useNavigate,useLocation} from 'react-router-dom'
import useRefreshToken from '../hooks/useRefreshToken'

const Users = () => {
  const [users,setUsers] = useState()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()
  const refresh = useRefreshToken()	

  const effectRun = useRef(false)	

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUsers = async () => {
      try{
        const response = await axiosPrivate.get('/users',{
          signal:controller.signal
	})
	console.log(response.data)
	isMounted && setUsers(response.data)
      }catch(err){
        console.error(err)
	navigate('/auth',{state:{from:location},replace:true})
      }
    }

    if(effectRun.current){
      getUsers()
    }

    return () => {
      isMounted:false
      controller.abort()
      effectRun.current = true
    }
  },[])

  return(
    <article> 
      <h2>Users List</h2>
      { users?.length
	  ? (
              <ul>
                { users.map((user,index) => {
                    return(
		      <li key={index}>
                        {user?.username}
		       </li>
		    )
		  })
		}
	      </ul>
	  ) : (<p>No users to display</p>)
      }

      <button
        onClick={
          () => refresh() 
	}
      >Refresh</button>
    </article>
  )
}

export default Users
