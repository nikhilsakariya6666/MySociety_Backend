const express = require('express')
const apiRouter = express.Router()

const userRouter = require('./users.route')
const societyRouter = require('./societys.route')
const complaintRouter = require('./complaints.route')
const positiveThoughtRouter = require('./positiveThoughts.route')
const announcementRouter = require('./announcements.route')
const eventRouter = require('./events.route')
const noticeRouter = require('./notices.route')
const discussionRouter = require('./discussions.route')
const faqRouter = require('./fAQs.route')
const galleryRouter = require('./gallerys.route')
const expenseIncomeRouter = require('./expenseIncomes.route')


apiRouter.use('/user', userRouter);
apiRouter.use('/society', societyRouter);
apiRouter.use('/complaint', complaintRouter);
apiRouter.use('/positiveThought', positiveThoughtRouter);
apiRouter.use('/announcement', announcementRouter);
apiRouter.use('/event', eventRouter);
apiRouter.use('/notice', noticeRouter);
apiRouter.use('/discussion', discussionRouter);
apiRouter.use('/faq', faqRouter);
apiRouter.use('/gallery', galleryRouter);
apiRouter.use('/expenseIncome', expenseIncomeRouter);

module.exports = apiRouter