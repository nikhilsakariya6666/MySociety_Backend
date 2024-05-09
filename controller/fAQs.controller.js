//const jwt = require('jsonwebtoken')
const FAQ_COLLECTION = require('../module/fAQ.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create FAQ
*/

exports.createFaq = (req, res) => {
    const question = req.body.question
    const answer = req.body.answer
    const status = req.body.status
   
    if (!question || !answer || !status ) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const faqObj = {
            question: question,
            answer: answer,
            status: status,
            isDeleted: false
        };
        FAQ_COLLECTION.create(faqObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.FAQ + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update FAQ by id
*/
exports.updateFaqById = (req, res) => {
    const question = req.body.question
    const answer = req.body.answer
    const status = req.body.status
    const Id = req.params.id;

    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.FAQ + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        const faqObj = {
            question: question,
            answer: answer,
            status: status,
            isDeleted: false
        };
        FAQ_COLLECTION.findByIdAndUpdate(Id, { $set: faqObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({
                    status: CONSTANT.ERROR,
                    message: err
                });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.FAQ + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                data: result
            });
        });
    }
}

/*
TODO: GET
Topic: get FAQ by id
*/

exports.getfaqById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.FAQ + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        FAQ_COLLECTION.findById(Id)
            .then(faqs => {
                if (faqs) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: faqs
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
Topic: get all FAQS
*/
exports.findAllFaqs = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    FAQ_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        FAQ_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (faqsOperatorError, faqs_operators) {
            if (faqsOperatorError || !faqs_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.FAQ + CONSTANT.MESSAGE.DATA_FOUND, 
                    faqs_operators: faqs_operators, 
                    totalRecords: totalRecords 
                });
                console.log("faqs_operators",faqs_operators)
            }
        })
    })

}

/*
TODO: POST
Topic: delete FAQs by id
*/

exports.deleteFaqById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.FAQ + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        FAQ_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.FAQ + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateFAQ
exports.getPaginateFAQ = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  FAQ_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "FAQ founded", faq: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}