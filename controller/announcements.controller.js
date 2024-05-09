//const jwt = require('jsonwebtoken')
const ANNOUNCEMENT_COLLECTION = require('../module/announcements.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create Announcements
*/

exports.createAnnouncement = (req, res) => {
    const description = req.body.description
    const date = req.body.date
    const societyId = req.body.societyId


    if (!description || !date || !societyId) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const announcementObj = {
            description: description,
            date: date,
            societyId: societyId,
            isDeleted: false
        };
        ANNOUNCEMENT_COLLECTION.create(announcementObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.ANNOUNCEMENT + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update Announcements by id
*/
exports.updateAnnouncementById = (req, res) => {
    const description = req.body.description;
    const date = req.body.date;
    const societyId = req.body.societyId;
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.ANNOUNCEMENT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        const announcementObj = {
            description: description,
            date: date,
            societyId: societyId,
            isDeleted: false
        };
        ANNOUNCEMENT_COLLECTION.findByIdAndUpdate(Id, { $set: announcementObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({
                    status: CONSTANT.ERROR,
                    message: err
                });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.ANNOUNCEMENT + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                data: result
            });
        });
    }
}

/*
TODO: GET
Topic: get Announcements by id
*/

exports.getAnnouncementById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.ANNOUNCEMENT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        ANNOUNCEMENT_COLLECTION.findById(Id)
            .then(announcements => {
                if (announcements) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: announcements
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
Topic: get all Announcements
*/
exports.findAllAnnouncements = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    ANNOUNCEMENT_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        ANNOUNCEMENT_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (announcementsOperatorError, announcements_operators) {
            if (announcementsOperatorError || !announcements_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.ANNOUNCEMENT + CONSTANT.MESSAGE.DATA_FOUND, 
                    announcements_operators: announcements_operators, 
                    totalRecords: totalRecords 
                });
            }
        })
    })

}

/*
TODO: POST
Topic: delete Announcements by id
*/

exports.deleteAnnouncementsById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.ANNOUNCEMENT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        ANNOUNCEMENT_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.ANNOUNCEMENT + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateAnnuncement
exports.getPaginateAnnouncement = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  ANNOUNCEMENT_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Anouncement founded", anouncement: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}