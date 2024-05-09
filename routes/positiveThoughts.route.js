const express = require('express')
const positiveThoughtRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const positiveThoughtsController = require('../controller/positiveThoughts.controller')
//const auth = require('../common/authentication');

positiveThoughtRouter.post('/createPositiveThought', positiveThoughtsController.createPositiveThought);
positiveThoughtRouter.post('/updatePositiveThoughtById/:id', positiveThoughtsController.updatePositiveThoughtById);
positiveThoughtRouter.post('/deletePositiveThoughtById/:id', positiveThoughtsController.deletePositiveThoughtById);
positiveThoughtRouter.get('/findAllPositiveThoughts', positiveThoughtsController.findAllPositiveThoughts);
positiveThoughtRouter.get('/getPositiveThoughtById/:id', positiveThoughtsController.getPositiveThoughtById);
positiveThoughtRouter.post('/getPaginatePositiveThought', positiveThoughtsController.getPaginatePositiveThought);

module.exports = positiveThoughtRouter