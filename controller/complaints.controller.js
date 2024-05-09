//const jwt = require('jsonwebtoken')
const COMPLAINT_COLLECTION = require('../module/complaints.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create Complaint
*/

exports.createComplaint = (req, res) => {
    const complaintType = req.body.complaintType
    const description = req.body.description
    const createdBy = req.body.createdBy
    const complaintUserId = req.body.complaintUserId
    const complaintDate = req.body.complaintDate
    const remark = req.body.remark
    const resolvedDate = req.body.resolvedDate
    const status = req.body.status

    if (!complaintType || !createdBy || !complaintUserId || !complaintDate || !status) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const complaintObj = {
            complaintType: complaintType,
            description: description,
            createdBy: createdBy,
            complaintUserId: complaintUserId,
            complaintDate: complaintDate,
            remark: remark,
            resolvedDate: resolvedDate,
            status: status,
            isDeleted: false
        };
        COMPLAINT_COLLECTION.create(complaintObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.COMPLAINT + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update complaint by id
*/
exports.updateComplaintById = (req, res) => {
    const complaintType = req.body.complaintType;
    const description = req.body.description;
    const createdBy = req.body.createdBy;
    const complaintUserId = req.body.complaintUserId;
    const complaintDate = req.body.complaintDate;
    const remark = req.body.remark;
    const resolvedDate = req.body.resolvedDate;
    const status = req.body.status;
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.COMPLAINT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        const complaintObj = {
            complaintType: complaintType,
            description: description,
            createdBy: createdBy,
            complaintUserId: complaintUserId,
            complaintDate: complaintDate,
            remark: remark,
            resolvedDate: resolvedDate,
            status: status,
            isDeleted: false
        };
        COMPLAINT_COLLECTION.findByIdAndUpdate(Id, { $set: complaintObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({
                    status: CONSTANT.ERROR,
                    message: err
                });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.COMPLAINT + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                data: result
            });
        });
    }
}

/*
TODO: GET
Topic: get complaint by id
*/

exports.getComplaintById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.COMPLAINT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        COMPLAINT_COLLECTION.findById(Id)
            .then(complaints => {
                if (complaints) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: complaints
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
Topic: get all complaints
*/
exports.findAllComplaints = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    COMPLAINT_COLLECTION.countDocuments({ isDeleted: false }, {}).lean().exec(function (err, count) {
        totalRecords = count;
        COMPLAINT_COLLECTION.find({ isDeleted: false }, {}).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (complaintsOperatorError, complaints_operators) {
            if (complaintsOperatorError || !complaints_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message:CONSTANT.COLLECTION.COMPLAINT + CONSTANT.MESSAGE.DATA_FOUND,
                    complaints_operators : complaints_operators, 
                    totalRecords: totalRecords 
                });
            }
        })
    })

}

/*
TODO: POST
Topic: delete complaints by id
*/

exports.deleteComplaintById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.COMPLAINT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        COMPLAINT_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.COMPLAINT + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateComplaint
exports.getPaginateComplaint = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  COMPLAINT_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Complaint founded", complaint: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}