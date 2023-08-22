const usersDB = {
  users:require('../../models/users.json'),
  setUsers: function(data){
    this.users = data
  }
}
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req,res) => {
  const {user,password} = req.body
  if(!user || !password){
    return(
      res.status(400).json({
        "message":"username and password are required."
      })
    )
  
    res.status(200).json({
      "success":`User ${user} is logged in`,
      "message":"Authentication Controller"
    })
  }else{
    res.sendStatus(401)
  }
}

module.exports = {handleLogin}
