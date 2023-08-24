const User = require('../../../models/user')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req,res) => {
  const cookies = req.cookies
  if(!cookies?.jwt){
    return(
      res.sendStatus(401) //Unauthorized
    )
  }
  console.log('Cookie JWT:',cookies.jwt)
  const refreshToken = cookies.jwt

  const foundUser = await User.findOne({refreshToken}).exec()
  
  if(!foundUser){
    return(
      res.sendStatus(403) //Forbidden
    )
  }
  console.log('Found User:',foundUser)

  //Evaluate JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err,decoded) => {
      if(err || foundUser.username !== decoded.username){
        return(
          res.sendStatus(403) //Forbidden
	)
      }
      console.log('Decoded Username:',decoded.username)
      const accessToken = jwt.sign({
        "Userinfo":{
          "username":decoded.username
	  },
        },  	
	process.env.ACCESS_TOKEN_SECRET,
	{expiresIn:'30s'}
      )
      res.json({
        accessToken
      })
    }
  )
}

module.exports = {handleRefreshToken}
