const express = require('express')
const societyRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const societysController = require('../controller/societys.controller')
const auth = require('../common/authentication');

societyRouter.post('/registerSociety', societysController.registerSociety);
societyRouter.post('/loginSociety', societysController.loginSociety);
societyRouter.post('/updateSocietyDetailsById/:id', societysController.updateSocietyDetailsById);
societyRouter.post('/deleteSocietyById/:id',societysController.deleteSocietyById);
societyRouter.get('/getAllSociety',  societysController.getAllSociety);
societyRouter.get('/getSocietyById/:id', auth, societysController.getSocietyById);
societyRouter.post('/getPaginateSociety', societysController.getPaginateSociety);

module.exports = societyRouter