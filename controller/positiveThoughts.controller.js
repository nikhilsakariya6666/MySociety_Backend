//const jwt = require('jsonwebtoken')
const POSITIVETHOUGHT_COLLECTION = require('../module/positiveThoughts.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create PositiveThoughts
*/

exports.createPositiveThought = (req, res) => {
    console.log("req", req.body);

    const description = req.body.description
    const date = req.body.date
    const societyId = req.body.societyId


    if (!description || !date || !societyId) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const positiveThoughtObj = {
            description: description,
            date: date,
            societyId: societyId,
            isDeleted: false
        };
        POSITIVETHOUGHT_COLLECTION.create(positiveThoughtObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update PositiveThoughts by id
*/
exports.updatePositiveThoughtById = (req, res) => {
    const description = req.body.description;
    const date = req.body.date;
    const societyId = req.body.societyId;
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        const positiveThoughtObj = {
            description: description,
            date: date,
            societyId: societyId,
            isDeleted: false
        };
        POSITIVETHOUGHT_COLLECTION.findByIdAndUpdate(Id, { $set: positiveThoughtObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({
                    status: CONSTANT.ERROR,
                    message: err
                });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                data: result
            });
        });
    }
}

/*
TODO: GET
Topic: get PositiveThoughts by id
*/

exports.getPositiveThoughtById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        POSITIVETHOUGHT_COLLECTION.findById(Id)
            .then(positiveThoughts => {
                if (positiveThoughts) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: positiveThoughts
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
Topic: get all PositiveThoughts
*/
exports.findAllPositiveThoughts = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    POSITIVETHOUGHT_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        POSITIVETHOUGHT_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (positiveThoughtsOperatorError, positiveThoughts_operators) {
            if (positiveThoughtsOperatorError || !positiveThoughts_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.DATA_FOUND, 
                    positiveThoughts_operators: positiveThoughts_operators,
                    totalRecords: totalRecords 
                });
            }
        })
    })

}

/*
TODO: POST
Topic: delete PositiveThoughts by id
*/

exports.deletePositiveThoughtById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        POSITIVETHOUGHT_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginatePositiveThought
exports.getPaginatePositiveThought = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  POSITIVETHOUGHT_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "PositiveThought founded", positiveThought: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}


