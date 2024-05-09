const express = require('express')
const faqRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const faqsController = require('../controller/fAQs.controller')
//const auth = require('../common/authentication');

faqRouter.post('/createFaq', faqsController.createFaq);
faqRouter.post('/updateFaqById/:id', faqsController.updateFaqById);
faqRouter.post('/deleteFaqById/:id', faqsController.deleteFaqById);
faqRouter.get('/findAllFaqs', faqsController.findAllFaqs);
faqRouter.get('/getfaqById/:id', faqsController.getfaqById);
faqRouter.post('/getPaginateFAQ', faqsController.getPaginateFAQ);

module.exports = faqRouter