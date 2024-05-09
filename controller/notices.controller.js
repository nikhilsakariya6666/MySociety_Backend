//const jwt = require('jsonwebtoken')
const NOTICE_COLLECTION = require('../module/notice.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create Notice
*/

exports.createNotice = (req, res) => {
    const note = req.body.note
    const societyId = req.body.societyId
    const date = req.body.date
    const noticeType = req.body.noticeType
   
    if (!note || !societyId || !date || !noticeType) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const noticeObj = {
            note: note,
            societyId: societyId,
            date: date,
            noticeType: noticeType,
            isDeleted: false
        };
        NOTICE_COLLECTION.create(noticeObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.NOTICE  + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update Notice by id
*/
exports.updateNoticeById = (req, res) => {  
    const note = req.body.note
    const societyId = req.body.societyId
    const date = req.body.date
    const noticeType = req.body.noticeType
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.NOTICE + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    }  else {
            const noticeObj = {
                note: note,
                societyId: societyId,
                date: date,
                noticeType: noticeType,
                isDeleted: false
            };
            NOTICE_COLLECTION.findByIdAndUpdate(Id, { $set: noticeObj }, { new: true }, function (err, result) {
                if (err) {
                    res.send({
                        status: CONSTANT.ERROR,
                        message: err
                    });
                }
                res.send({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.NOTICE + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                    data: result
                });
            });
        }
}

/*
TODO: GET
Topic: get Notice by id
*/

exports.getNoticeById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.NOTICE + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        NOTICE_COLLECTION.findById(Id)
            .then(notices => {
                if (notices) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: notices
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
Topic: get all Notice
*/
exports.findAllNotices = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    NOTICE_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        NOTICE_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (noticesOperatorError, notices_operators) {
            if (noticesOperatorError || !notices_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.NOTICE + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.NOTICE + CONSTANT.MESSAGE.DATA_FOUND, 
                    notices_operators: notices_operators, 
                    totalRecords: totalRecords 
                });
                
            }
        })
    })

}

/*
TODO: POST
Topic: delete Notice by id
*/

exports.deleteNoticeById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.NOTICE + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        NOTICE_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.NOTICE + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateNotice
exports.getPaginateNotice = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  NOTICE_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Notice founded", notice: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}
