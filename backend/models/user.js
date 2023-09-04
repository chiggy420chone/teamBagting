const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  roles:{
    User:{
      type:Number,
      default:2001
    },
    Editor:{
      type:Number
    },
    Admin:{
      type:Number
    }
  },
  refreshToken:{
    type:[String]
  }
})

const User = mongoose.model('User',userSchema)

module.exports = User
