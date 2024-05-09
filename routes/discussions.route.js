const express = require('express')
const discussionRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const discussionsController = require('../controller/discussions.controller')
//const auth = require('../common/authentication');

discussionRouter.post('/createDiscussion', discussionsController.createDiscussion);
discussionRouter.post('/updateDiscussionById/:id', discussionsController.updateDiscussionById);
discussionRouter.post('/deleteDiscussionById/:id', discussionsController.deleteDiscussionById);
discussionRouter.get('/findAllDiscussions', discussionsController.findAllDiscussions);
discussionRouter.get('/getDiscussionById/:id', discussionsController.getDiscussionById);
discussionRouter.post('/getPaginateDiscussion', discussionsController.getPaginateDiscussion);

module.exports = discussionRouter