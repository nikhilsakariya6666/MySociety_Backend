const SOCIETY_COLLECTION = require("../module/societys.module");
const CONSTANT = require('../common/constant');
const jwt = require('jsonwebtoken');
const commonService = require('../common/common');
const { validationResult } = require('express-validator');

/*
TODO: POST
Topic: Register Society
*/

exports.registerSociety = (req, res) => {
    const societyName = req.body.societyName
    const societyEmail = req.body.societyEmail
    const password = req.body.password
    const address = req.body.address
    const contactUserId = req.body.contactUserId
    const contactUserContactNo = req.body.contactUserContactNo
    const initialCapital = req.body.initialCapital
    const totalBalance = req.body.totalBalance


    if (commonService.isUndefinedOrNull(societyEmail)) {
        return res.json({
            status: CONSTANT.FAIL,
            message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING
        });
    } else {
        if (!commonService.validateEmail(societyEmail)) {
            return res.json({
                status: CONSTANT.FAIL,
                message: CONSTANT.MESSAGE.EMAIL_INVALID
            });
        } else {
            SOCIETY_COLLECTION.findOne({ societyEmail: societyEmail, isDeleted: false })
                .then(
                    society => {
                        if (society) {
                            return res.json({
                                status: CONSTANT.FAIL,
                                message: CONSTANT.MESSAGE.EMAIL_EXIST
                            });
                        } else {
                            commonService.encryptPassword(password, newPassword => {
                                const society = {
                                    societyName: societyName ? societyName : "",
                                    societyEmail: societyEmail,
                                    password: newPassword ? newPassword : "",
                                    address: address ? address : "",
                                    contactUserId: contactUserId ? contactUserId : "",
                                    contactUserContactNo: contactUserContactNo ? contactUserContactNo : "",
                                    initialCapital: initialCapital ? initialCapital : "",
                                    totalBalance: totalBalance ? totalBalance : "",
                                    isDeleted: false
                                };

                                SOCIETY_COLLECTION.create(society, function (err, result) {
                                    if (err) {
                                        return res.send({ status: CONSTANT.FAIL, message: "", err: err });
                                    } else {
                                        return res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.REGISTER_SUCCESSFULLY, data: result });
                                    }
                                });
                            });
                        }
                    }
                )
        }
    }
}

/*
TODO: POST
Topic: Login Society
*/

exports.loginSociety = (req, res, err) => {
    console.log(req.body);
    const societyEmail = req.body.societyEmail
    const password = req.body.password
    if (commonService.isUndefinedOrNull(password) || commonService.isUndefinedOrNull(societyEmail)) {
        return res.json({
            status: CONSTANT.FAIL,
            message: CONSTANT.MESSAGE.EMAIL_INVALID
        });
    } else {
        //console.log("2");
        //check Society is reister or not
        SOCIETY_COLLECTION.findOne({ societyEmail: societyEmail, isDeleted: false })
            .then(society => {
                console.log("society", society);
                if (society) {
                    commonService.decryptPassword(society.password, (decryptedpassword) => {
                        if (password == decryptedpassword) {
                            var societyDetails = {
                                societyName: society.societyName,
                                societyEmail: society.societyEmail,
                                address: society.address,
                                contactUserId: society.contactUserId,
                                contactUserContactNo: society.contactUserContactNo,
                                initialCapital: society.initialCapital,
                                totalBalance: society.totalBalance,
                                id: society.id
                            };
                            // create token for session
                            var token = jwt.sign(societyDetails, "testing", {
                                expiresIn: 2592000  // expires in 30 days
                            });
                            return res.send({
                                status: CONSTANT.SUCCESS,
                                message: CONSTANT.MESSAGE.LOGIN_SUCESSFULLY,
                                data: societyDetails,
                                token: token
                            });


                            //   return res.json({
                            //     status: CONSTANT.SUCCESS,
                            //     message: CONSTANT.MESSAGE.LOGIN_SUCESSFULLY,
                            //     data: userDetails
                            // });

                        } else {
                            return res.json({
                                status: CONSTANT.FAIL,
                                message: CONSTANT.MESSAGE.PASSOWRD_INVALID
                            });
                        }
                    })
                } else {
                    return res.send({
                        status: CONSTANT.FAIL,
                        message: err.MESSAGE || CONSTANT.MESSAGE.EMAIL_INVALID
                    })
                }
            })
            .catch(err => ({
                status: CONSTANT.FAIL,
                message: EvalError.message || CONSTANT.MESSAGE.ERROR_OCCURRED
            })
            )
    }
}

/*
TODO: POST
Topic: update Society
*/

exports.updateSocietyDetailsById = (req, res) => {
    const societyName = req.body.societyName;
    const societyEmail = req.body.societyEmail;
    const address = req.body.address;
    const contactUserId = req.body.contactUserId;
    const contactUserContactNo = req.body.contactUserContactNo;
    const initialCapital = req.body.initialCapital;
    const totalBalance = req.body.totalBalance;
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    }
    // else
    //  {
    //     if (!topicArea || !examTitle) {
    //         return res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    //     } 
    else {
        const societyObj = {
            societyName: societyName,
            societyEmail: societyEmail,
            address: address,
            contactUserId: contactUserId,
            contactUserContactNo: contactUserContactNo,
            initialCapital:initialCapital,
            totalBalance:totalBalance,
        };
        SOCIETY_COLLECTION.findByIdAndUpdate(Id, { $set: societyObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY, data: result });
        });
    }
    // }
}

/*
TODO: GET
Topic: get getAllSociety
*/

exports.getAllSociety = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 20;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    SOCIETY_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        SOCIETY_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (societyOperatorError, society_operators) {
            if (societyOperatorError || !society_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.POSITIVETHOUGHT + CONSTANT.MESSAGE.DATA_FOUND, 
                    society_operators: society_operators, 
                    totalRecords: totalRecords 
                });
            }
        })
    })
};

/*
TODO: GET
Topic: get Society ById
*/

exports.getSocietyById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        SOCIETY_COLLECTION.findById(Id).then(society => {
            if (society) {
                res.send({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.MESSAGE.DATA_FOUND,
                    data: society
                });
            } else {
                return res.send({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.MESSAGE.DATA_NOT_FOUND
                });
            }
        });
    }
};

/*
TODO: POST
Topic: delete User ById
*/

exports.deleteSocietyById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        let myquery = { _id: Id };
        SOCIETY_COLLECTION.findByIdAndUpdate(myquery,{ $set: { isDeleted: true } },{ new: false },
            function (err, result) {
                if (err) {
                    res.send({ status: CONSTANT.ERROR, message: err });
                } else {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message:
                            CONSTANT.COLLECTION.SOCIETY + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
                    });
                }

            }
        );
    }
};

// Method: POST
// TODO: getPaginateSociety
exports.getPaginateSociety = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  SOCIETY_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Society founded", society: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}