const router = require('express').Router()
const {handleNewUser} = require('../controls/firstLevel/registerController')

router.route('/')
  .post(handleNewUser)

module.exports = router
