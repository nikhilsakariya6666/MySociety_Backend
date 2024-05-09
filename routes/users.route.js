const express = require('express')
const userRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const usersController = require('../controller/users.controller')
const auth = require('../common/authentication');

userRouter.post('/registerUser', usersController.registerUser);
userRouter.post('/loginUser', usersController.loginUser);
userRouter.post('/updateUserDetailsById/:id', usersController.updateUserDetailsById);
userRouter.post('/deleteUserById/:id', usersController.deleteUserById);
userRouter.get('/getAllUser', usersController.getAllUser);
userRouter.get('/getUserById/:id', auth, usersController.getUserById);
userRouter.post('/getPaginateUser', usersController.getPaginateUser);

module.exports = userRouter




// SOCIETY_COLLECTION.findById(societyId, {}, function (err, result) {
//     //console.log("result", result);
//     let amount = result.totalAvailability;
//     amount = amount - debitAmount
//     SOCIETY_COLLECTION.findByIdAndUpdate(result._id, { "totalAvailability": amount }, { new: true }, function (err, result) {

//     })