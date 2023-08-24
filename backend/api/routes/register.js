const router = require('express').Router()
const {handleNewUser} = require('../controls/secondLevel/registerController')

router.route('/')
  .post(handleNewUser)

module.exports = router
