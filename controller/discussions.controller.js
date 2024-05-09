//const jwt = require('jsonwebtoken')
const DISCUSSION_COLLECTION = require('../module/discussion.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create Discussion
*/

exports.createDiscussion = (req, res) => {
    const topic = req.body.topic
    const discussionDate = req.body.discussionDate
    const societyId = req.body.societyId
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const comment = req.body.comment
  
    if (!topic || !discussionDate || !societyId || !startDate || !endDate) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const discussionObj = {
            topic: topic,
            discussionDate: discussionDate,
            societyId: societyId,
            startDate: startDate,
            endDate: endDate,
            comment: comment,
            isDeleted: false
        };
        DISCUSSION_COLLECTION.create(discussionObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.DISCUSSION + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update Discussion by id
*/
exports.updateDiscussionById = (req, res) => {  
    const topic = req.body.topic;
    const discussionDate = req.body.discussionDate;
    const societyId = req.body.societyId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const comment = req.body.comment;
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.DISCUSSION + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    }  else {
            const discussionObj = {
                topic: topic,
                discussionDate: discussionDate,
                societyId: societyId,
                startDate: startDate,
                endDate: endDate,
                comment: comment,
                isDeleted: false
            };
            DISCUSSION_COLLECTION.findByIdAndUpdate(Id, { $set: discussionObj }, { new: true }, function (err, result) {
                if (err) {
                    res.send({
                        status: CONSTANT.ERROR,
                        message: err
                    });
                }
                res.send({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.DISCUSSION + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                    data: result
                });
            });
        }
}

/*
TODO: GET
Topic: get Discussion by id
*/

exports.getDiscussionById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.DISCUSSION + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        DISCUSSION_COLLECTION.findById(Id)
            .then(discussions => {
                if (discussions) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: discussions
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
Topic: get all Discussion
*/
exports.findAllDiscussions = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);   
    var totalRecords = 0;
    DISCUSSION_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function(err, count) {
        totalRecords = count;
        DISCUSSION_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function(discussionsOperatorError, discussions_operators) {
            if (discussionsOperatorError || !discussions_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.DISCUSSION + CONSTANT.MESSAGE.DATA_FOUND, 
                    discussions_operators: discussions_operators, 
                    totalRecords: totalRecords 
                });
            }
        })
    })

}

/*
TODO: POST
Topic: delete Discussion by id
*/

exports.deleteDiscussionById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.DISCUSSION + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        DISCUSSION_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.DISCUSSION + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateDiscussion
exports.getPaginateDiscussion = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  DISCUSSION_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Discussion founded", discussion: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}