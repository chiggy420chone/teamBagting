const User = require('../../../models/user')
const jwt = require('jsonwebtoken')

const dashboard = async (req,res) => {
  const cookies = req.cookies
  if(!cookies?.jwt){
    return(
      res.sendStatus(401)
    )
  }
  const refreshToken = cookies.jwt

  const foundUser = await User.findOne({refreshToken}).exec()

  console.log('Found User:',foundUser)
  if(!foundUser){
    return(
      res.sendStatus(403)
    )
  }
  
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err,decoded) => {
      if(err || foundUser.username !== decoded.username){
        return(
	  res.sendStatus(403)
	)
      }
    }
  )
}

module.exports = dashboard
