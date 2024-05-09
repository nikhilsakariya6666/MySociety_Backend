//const jwt = require('jsonwebtoken')
const EXPENSEINCOME_COLLECTION = require('../module/expenseIncome.module');
const SOCIETY_COLLECTION = require('../module/societys.module')
const commonService = require("../common/common");
const CONSTANT = require('../common/constant')

/*
TODO: POST
Topic: Create ExpenseIncome
*/

exports.createExpenseIncome = (req, res) => {
    const societyId = req.body.societyId
    const shortDescription = req.body.shortDescription
    const longDescription = req.body.longDescription
    const debitAmount = req.body.debitAmount
    const creditAmount = req.body.creditAmount
    const isDebit = req.body.isDebit
    console.log("req.body   ", req.body)

    if (!societyId || !shortDescription) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        SOCIETY_COLLECTION.findById(societyId, {}, function (err, result) {
            console.log("result", result);

            let amount = result.totalBalance ? parseFloat(result.totalBalance) : 0;
            console.log("before amount", amount)
            amount = isDebit ? (parseFloat(amount) - parseFloat(debitAmount)) : (parseFloat(amount) + parseFloat(creditAmount))
            console.log("after amount", amount)

            //console.log("credit", amount)
            SOCIETY_COLLECTION.findByIdAndUpdate(result._id, { "totalBalance": amount.toString() }, { new: true }, function (err, result) { })
        })

        const expenseIncomeObj = {
            societyId: societyId,
            shortDescription: shortDescription,
            longDescription: longDescription,
            debitAmount: debitAmount,
            creditAmount: creditAmount,
            isDebit: true,
            isDeleted: false
        };
        EXPENSEINCOME_COLLECTION.create(expenseIncomeObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update ExpenseIncome by id
*/
exports.updateExpenseIncomeById = (req, res) => {
    console.log("req.body", req.body);

    const { societyId, shortDescription, longDescription, } = req.body;
    // const societyId = req.body.societyId
    // const shortDescription = req.body.shortDescription
    // const longDescription = req.body.longDescription
    const isDebit = req.body.isDebit
    const debitAmount = req.body.debitAmount
    const creditAmount = req.body.creditAmount
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        SOCIETY_COLLECTION.findById(societyId, {}, function (err, result) {
            console.log("result", result);

            let amount = result.totalBalance ? parseFloat(result.totalBalance) : 0;
            amount = isDebit ? (amount - debitAmount) : (amount + parseFloat(creditAmount))

            console.log("credit", amount)
            SOCIETY_COLLECTION.findByIdAndUpdate(result._id, { "totalBalance": amount.toString() }, { new: true }, function (err, result) {
                const expenseIncomeObj = {
                    societyId: societyId,
                    shortDescription: shortDescription,
                    longDescription: longDescription,
                    debitAmount: debitAmount,
                    creditAmount: creditAmount,
                    isDebit: isDebit,
                    isDeleted: false
                };
                EXPENSEINCOME_COLLECTION.findByIdAndUpdate(Id, { $set: expenseIncomeObj }, { new: true }, function (err, result) {
                    if (err) {
                        res.send({
                            status: CONSTANT.ERROR,
                            message: err
                        });
                    }
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                        data: result
                    });
                });
            })

        });


    }
}

/*
TODO: GET
Topic: get ExpenseIncome by id
*/

exports.getExpenseIncomeById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        EXPENSEINCOME_COLLECTION.findById(Id)
            .then(expenseIncomes => {
                if (expenseIncomes) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: expenseIncomes
                    });
                } else {
                    return res.send({
                        status: CONSTANT.FAIL,
                        message: CONSTANT.MESSAGE.DATA_NOT_FOUND
                    });
                }
            })
    }
}
/*
TODO: GET
Topic: get all ExpenseIncome
*/
exports.findAllExpenseIncomes = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    EXPENSEINCOME_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        EXPENSEINCOME_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (expenseIncomesOperatorError, expenseIncomes_operators) {
            if (expenseIncomesOperatorError || !expenseIncomes_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.DATA_FOUND,
                    expenseIncomes_operators: expenseIncomes_operators,
                    totalRecords: totalRecords
                });

            }
        })
    })

}

/*
TODO: POST
Topic: delete ExpenseIncome by id
*/

exports.deleteExpenseIncomeById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        EXPENSEINCOME_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.EXPENSEINCOME + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateExpenseIncome
exports.getPaginateExpenseIncome = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  EXPENSEINCOME_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "ExpenseIncome founded", expenseIncome: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}