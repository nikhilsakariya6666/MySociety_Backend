const express = require('express')
const noticeRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const noticesController = require('../controller/notices.controller')
//const auth = require('../common/authentication');

noticeRouter.post('/createNotice', noticesController.createNotice);
noticeRouter.post('/updateNoticeById/:id', noticesController.updateNoticeById);
noticeRouter.post('/deleteNoticeById/:id', noticesController.deleteNoticeById);
noticeRouter.get('/findAllNotices', noticesController.findAllNotices);
noticeRouter.get('/getNoticeById/:id', noticesController.getNoticeById);
noticeRouter.post('/getPaginateNotice', noticesController.getPaginateNotice);

module.exports = noticeRouter