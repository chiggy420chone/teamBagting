const usersDB = {
  users:require('../../../models/usersFile.json'),
  setUsers:function(data){
    this.users = data
  }
}
const jwt = require('jsonwebtoken')

const dashboard = (req,res) => {
  const cookies = req.cookies
  if(!cookies?.jwt){
    return(
      res.sendStatus(401)
    )
  }
  console.log('Cookie:',cookies.jwt)
  const refreshToken = cookies.jwt

  const foundUser =
    usersDB.users.find(person => person.refreshToken === refreshToken)

  if(!foundUser){
    return(
      res.sendStatus(403)
    )
  }
  //Evaluate JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err,decoded) => {
      if(err || foundUser.username !== decoded.username){
        return(
          res.sendStatus(403)
	)
      }
    
      const accessToken = jwt.sign(
        {"username":decoded.username},
	process.env.ACCESS_TOKEN_SECRET,
	{expiresIn:'30s'}
      )
      res.status(200).json({
        accessToken
      })
    }
  )
}

module.exports = dashboard

