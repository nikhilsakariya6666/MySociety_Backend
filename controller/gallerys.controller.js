//const jwt = require('jsonwebtoken')
const GALLERY_COLLECTION = require('../module/gallery.module');
const commonService = require("../common/common");
const CONSTANT = require('../common/constant');

/*
TODO: POST
Topic: Create Gallery
*/

exports.createGallery = (req, res) => {
    const image = req.body.image
    const eventDate = req.body.eventDate

    if (!image || !eventDate) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else {
        const galleryObj = {
            image: image,
            eventDate: eventDate,
            isDeleted: false
        };
        GALLERY_COLLECTION.create(galleryObj, function (err, result) {
            if (err) {
                res.json({ status: CONSTANT.FAIL, message: "", err: err });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.ADDED_SUCCESSFULLY,
                    data: result
                });
            }
        })
    }
}

/*
TODO: POST
Topic: update Gallery by id
*/
exports.updateGalleryById = (req, res) => {
    const image = req.body.image
    const eventDate = req.body.eventDate
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        const galleryObj = {
            image: image,
            eventDate: eventDate,
            isDeleted: false
        };
        GALLERY_COLLECTION.findByIdAndUpdate(Id, { $set: galleryObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({
                    status: CONSTANT.ERROR,
                    message: err
                });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY,
                data: result
            });
        });
    }
}

/*
TODO: GET
Topic: get Gallery by id
*/

exports.getGalleryById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        GALLERY_COLLECTION.findById(Id)
            .then(gallerys => {
                if (gallerys) {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message: CONSTANT.MESSAGE.DATA_FOUND,
                        data: gallerys
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
Topic: get all Gallery
*/
exports.findAllGallerys = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 10;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    GALLERY_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        GALLERY_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (gallerysOperatorError, gallerys_operators) {
            if (gallerysOperatorError || !gallerys_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.DATA_FOUND, 
                    gallerys_operators: gallerys_operators, 
                    totalRecords: totalRecords 
                });
            }
        })
    })

}

/*
TODO: POST
Topic: delete Gallery by id
*/

exports.deleteGalleryById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        GALLERY_COLLECTION.findByIdAndUpdate(Id,{$set : {isDeleted : true}} , function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({
                status: CONSTANT.SUCCESS,
                message: CONSTANT.COLLECTION.GALLERY + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
            });
        });
    }
};

// Method: POST
// TODO: getPaginateGallery
exports.getPaginateGallery = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  GALLERY_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Gallery founded", gallery: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}

