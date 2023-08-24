const router = require('express').Router()
const {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
} = require('../controls/secondLevel/employeesController')
const ROLES_LIST = require('../../configs/roles_list')
const verifyRoles = require('../../middlewares/verifyRoles')


router.route('/')
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),createNewEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin),deleteEmployee)

router.route('/:id')
  .get(getEmployee)
  .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),updateEmployee)

module.exports = router
