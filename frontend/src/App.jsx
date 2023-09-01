import {Fragment } from 'react'
import Layout from './components/Layout'
import Register from './components/register'
import Login from './components/Login'
import LinkPage from './components/LinkPage'
import Unauthorized from './components/Unauthorized'
import Home from './components/Home'
import Editor from './components/Editor'
import Admin from './components/Admin'
import Lounge from './components/Lounge'
import Missing from './components/Missing'
import RequireAuth from './components/RequireAuth'
import PersistLogin from './components/PersistLogin'
import {Routes,Route} from 'react-router-dom'
import './styles/App.css'

const ROLES = {
  "User":2001,
  "Editor":1984,
  "Admin":5150
}


const App = () => {
  return(
    <Fragment>
      <Routes>
        <Route path="/" element={<Layout />} >
	  {/*--Public Routes --*/}
	  <Route path="register" element={<Register />} />
	  <Route path="auth" element={<Login />} />
	  <Route path="linkpage" element={<LinkPage />} />
	  <Route path="unauthorized" element={<Unauthorized />} />
          {/*--Protected Routes--*/}
	  <Route element={<PersistLogin />} >
	  <Route element={<RequireAuth allowedRoles={[ROLES.User]} />} >
	    <Route path="/" element={<Home />} />
	  </Route>
	  <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />} >
	    <Route path="editor" element={<Editor />} />
	  </Route>
	  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />} >
	    <Route path="admin" element={<Admin />} />
	  </Route>
	  <Route element={<RequireAuth  
	    allowedRoles={[ROLES.Editor,ROLES.Admin]} />} >
	    <Route path="lounge" element={<Lounge />} />
	  </Route>
	  </Route>
          {/*--Catch All --*/}
          <Route path="*" element={<Missing />} />
	</Route>
      </Routes>
    </Fragment>
  )
}

export default App
