const usersDB = {
  users:require('../../../models/usersFile.json'),
  setUsers:function(data){
    this.users = data  
  }
}
const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req,res) => {
  const cookies = req.cookies
  console.log('Cookies:',cookies)
  if(!cookies?.jwt){
    return(
      res.sendStatus(204) //No Content
    )
  }
  console.log('Cookies JWT:',cookies.jwt)
  const refreshToken = cookies.jwt

  //Is refreshToken In DB	
  const foundUser = 
    usersDB.users.find(
      person => person.refreshToken === refreshToken
    )
  if(!foundUser){
    res.clearCookie('jwt',{
      httpOnly:true,
      sameSite:'None',
      secure:true,
      maxAge:1000 * 60 * 3 * 1
    })
    return(
      res.sendStatus(204)
    )
  }

  //Delete refreshToken In DB
  const otherUsers = usersDB.users.filter(
    person => person.refreshToken !== foundUser.refreshToken
  )

  const currentUser = {...foundUser,refreshToken:''}
  usersDB.setUsers([...otherUsers,currentUser])
  await fsPromises.writeFile(
    path.join(__dirname,'../../../','models','usersFile.js'),
    JSON.stringify(usersDB.users)
  )
  res.clearCookie('jwt',{
    httpOnly:true,
    sameSite:'None',
    secure:true,
  })
  res.sendStatus(204)
}

module.exports = {handleLogout}

