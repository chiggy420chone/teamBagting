const dotenv = require('dotenv').config()
const connectDB = require('./configs/initDB')

const app = require('./app')

//Handle Uncaught Exceptions
process.on('uncaughtException',(err) => {
  console.log(`ERROR: ${err.message}`)
  console.log('Shutting Down Due To Uncaught Exception')
  process.exit(1)
})

//Connect To Database
connectDB()

//Create Server
const server = app.listen(process.env.PORT,() => {
  console.log('### Server Started On Port: '+process.env.PORT+' ###')
  console.log('### Running On A '+process.env.NODE_ENV+' Mode ###')
})

//Handle Unhandles Promise Rejections
process.on('unhandledRejection',(err) => {
  console.log(`ERROR: ${err.message}`)
  console.log('Shutting Down Server Due To Unhandled Promise Rejection')
  server.close(() => {
    process.exit(1)
  })
})
