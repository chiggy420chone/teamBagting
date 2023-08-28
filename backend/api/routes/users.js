const express = require('express');
const router = express.Router();
const usersController = require('../controls/secondLevel/usersController');
const ROLES_LIST = require('../../configs/roles_list');
const verifyRoles = require('../../middlewares/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

module.exports = router;
