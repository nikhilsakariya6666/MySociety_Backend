//const jwt = require('jsonwebtoken')
const EVENT_COLLECTION = require('../module/event.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create Event
*/

exports.createEvent = (req, res) => {
    const eventName = req.body.eventName
    const description = req.body.description
    const note = req.body.note
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const societyId = req.body.societyId
    const address = req.body.address

    if (!eventName || !description || !startDate || !endDate || !societyId || !address) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const eventObj = {
            eventName: eventName,
            description: description,
            note: note,
            startDate: startDate,
            endDate: endDate,
            societyId: societyId,
            address: address,
            isDeleted: false
        };
        EVENT_COLLECTION.create(eventObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.EVENT + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update event by id
*/
exports.updateEventById = (req, res) => {
    const eventName = req.body.eventName;
    const description = req.body.description;
    const note = req.body.note;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const societyId = req.body.societyId;
    const address = req.body.address;
    const Id = req.params.id;

    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.EVENT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        const eventObj = {
            eventName: eventName,
            description: description,
            note: note,
            startDate: startDate,
            endDate: endDate,
            societyId: societyId,
            address: address,
            isDeleted: false
        };
        EVENT_COLLECTION.findByIdAndUpdate(Id, { $set: eventObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({
                    status: CONSTANT.ERROR,
                    message: err
                });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.EVENT + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                data: result
            });
        });
    }
}

/*
TODO: GET
Topic: get event by id
*/

exports.getEventById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.EVENT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        EVENT_COLLECTION.findById(Id)
            .then(events => {
                if (events) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: events
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
Topic: get all events
*/
exports.findAllEvents = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    EVENT_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        EVENT_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (eventsOperatorError, events_operators) {
            if (eventsOperatorError || !events_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.EVENT + CONSTANT.MESSAGE.DATA_FOUND, 
                    events_operators: events_operators,
                    totalRecords: totalRecords,
                });
            }
        })
    })

}

/*
TODO: POST
Topic: delete events by id
*/

exports.deleteEventById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.EVENT + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        EVENT_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.EVENT + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateEvent
exports.getPaginateEvent = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  EVENT_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Event founded", event: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}