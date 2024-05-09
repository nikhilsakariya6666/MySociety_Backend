const express = require('express')
const complaintRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const complaintsController = require('../controller/complaints.controller')
//const auth = require('../common/authentication');

complaintRouter.post('/createComplaint', complaintsController.createComplaint);
complaintRouter.post('/updateComplaintById/:id', complaintsController.updateComplaintById);
complaintRouter.post('/deleteComplaintById/:id', complaintsController.deleteComplaintById);
complaintRouter.get('/findAllComplaints', complaintsController.findAllComplaints);
complaintRouter.get('/getComplaintById/:id', complaintsController.getComplaintById);
complaintRouter.post('/getPaginateComplaint', complaintsController.getPaginateComplaint);

module.exports = complaintRouter