const express = require('express')
const eventRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const eventsController = require('../controller/events.controller')
//const auth = require('../common/authentication');

eventRouter.post('/createEvent', eventsController.createEvent);
eventRouter.post('/updateEventById/:id', eventsController.updateEventById);
eventRouter.post('/deleteEventById/:id', eventsController.deleteEventById);
eventRouter.get('/findAllEvents', eventsController.findAllEvents);
eventRouter.get('/getEventById/:id', eventsController.getEventById);
eventRouter.post('/getPaginateEvent', eventsController.getPaginateEvent);

module.exports = eventRouter