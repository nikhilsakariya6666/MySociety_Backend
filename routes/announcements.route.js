const express = require('express')
const announcementRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const announcementsController = require('../controller/announcements.controller')
//const auth = require('../common/authentication');

announcementRouter.post('/createAnnouncement', announcementsController.createAnnouncement);
announcementRouter.post('/updateAnnouncementById/:id', announcementsController.updateAnnouncementById);
announcementRouter.post('/deleteAnnouncementsById/:id', announcementsController.deleteAnnouncementsById);
announcementRouter.get('/findAllAnnouncements', announcementsController.findAllAnnouncements);
announcementRouter.get('/getAnnouncementById/:id', announcementsController.getAnnouncementById);
announcementRouter.post('/getPaginateAnnouncement', announcementsController.getPaginateAnnouncement);

module.exports = announcementRouter