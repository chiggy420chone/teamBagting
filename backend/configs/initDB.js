const mongoose = require('mongoose')

const connectDB = async () => {
  try{
    const connect = await mongoose.connect(process.env.MongoDB_URI,{
      useNewUrlParser:true,
      useUnifiedTopology:true
    })
    console.log('### MongoDB Connected With Host: ')
    console.log(`${connect.connection.host} ###`)
  }catch(err){
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
