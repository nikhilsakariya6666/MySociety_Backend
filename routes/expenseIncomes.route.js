const express = require('express')
const expenseIncomeRouter = express.Router()
//const rolesValidator = require('../middleware/roles.middleware')
const expenseIncomesController = require('../controller/expenseIncomes.controller')
//const auth = require('../common/authentication');

expenseIncomeRouter.post('/createExpenseIncome', expenseIncomesController.createExpenseIncome);
expenseIncomeRouter.post('/updateExpenseIncomeById/:id', expenseIncomesController.updateExpenseIncomeById);
expenseIncomeRouter.post('/deleteExpenseIncomeById/:id', expenseIncomesController.deleteExpenseIncomeById);
expenseIncomeRouter.get('/findAllExpenseIncomes', expenseIncomesController.findAllExpenseIncomes);
expenseIncomeRouter.get('/getExpenseIncomeById/:id', expenseIncomesController.getExpenseIncomeById);
expenseIncomeRouter.post('/getPaginateExpenseIncome', expenseIncomesController.getPaginateExpenseIncome);

module.exports = expenseIncomeRouter