const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  }
})

const Employee = mongoose.model('Employee',employeeSchema)

module.exports = Employee
