const usersDB = {
  users:require('../../models/users.json'),
  setUsersDB:function(data){
    this.users = data
  }
}

const jwt = require('jsonwebtoken')

const handleRefreshToken = (req,res) => {
  const cookies = req.cookies
  if(!cookies?.jwt){
    return(
      res.sendStatus(401)
    )
  }
  console.log(cookies.jwt)

  res.sendStatus(200)
}

module.exports = {handleRefreshToken}

