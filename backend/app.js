const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const corsOptions = require('./configs/corsOptions')
const cookieParser = require('cookie-parser')
const {logger} = require('./middlewares/logEvents')
const errorHandler = require('./middlewares/errorHandler')
const credentials = require('./middlewares/credentials')
const verifyJWT = require('./middlewares/verifyJWT')

const app = express()

//Import Routes

//Custome Middleware Logger
app.use(logger)

app.use(credentials)
app.use(cors(corsOptions))

/*-- Built-in middleware to handle urlencoded data.
     In other words, form data:
     'content-type:application/x-www-form-urlencoded'
--*/
app.use(express.urlencoded({extended:false}))

////built-in middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//Static Files
app.use(express.static(path.join(__dirname,'/public')))
//Middlewares
app.use((req,res,next) => {
  const currentTime = new Date().toString()
  console.log('Time & Date:',currentTime )
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

//Routes
app.use('/register',require('./api/routes/register'))
app.use('/auth',require('./api/routes/auth'))
app.use('/refresh',require('./api/routes/refresh'))
app.use('/logout',require('./api/routes/logout'))
//app.use('/dashboard',require('./api/routes/dashboard'))
//Authenticated Routes
app.use(verifyJWT)
app.use('/dashboard',require('./api/routes/dashboard'))
app.use('/employees',require('./api/routes/employees'))

//Routes Handler
app.get('^/$|/index(.html)?',(req,res) => {
  res.status(200)
    .sendFile(
      path.join(__dirname,'views','index.html')
    )
})

app.get('/test',(req,res) => {
  res.status(200).json({
    "message":"Test Connection Has Been Established"
  })
})

app.all('*',(req,res) => {
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname,'views','404.html'))
  }else if(req.accepts('json')){
    res.json({error:'404 Not Found'})
  }else{
    res.type('txt').send("404 Not Found")
  }
})

//Error Handler
app.use(errorHandler)

module.exports = app
