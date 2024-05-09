const USER_COLLECTION = require("../module/users.module");
const CONSTANT = require('../common/constant');
const jwt = require('jsonwebtoken');
const commonService = require('../common/common');
const { validationResult } = require('express-validator');

/*
TODO: POST
Topic: Register User
*/

exports.registerUser = (req, res) => {
    const userName = req.body.userName
    const userEmail = req.body.userEmail
    const password = req.body.password
    const contactNo = req.body.contactNo
    const address_1 = req.body.address_1
    const address_2 = req.body.address_2
    const city = req.body.city
    const state = req.body.state
    const userType = req.body.userType

    if (commonService.isUndefinedOrNull(userEmail)) {
        return res.json({
            status: CONSTANT.FAIL,
            message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING
        });
    } else {
        if (!commonService.validateEmail(userEmail)) {
            return res.json({
                status: CONSTANT.FAIL,
                message: CONSTANT.MESSAGE.EMAIL_INVALID
            });
        } else {
            USER_COLLECTION.findOne({ userEmail: userEmail, isDeleted: false })
                .then(
                    user => {
                        if (user) {
                            return res.json({
                                status: CONSTANT.FAIL,
                                message: CONSTANT.MESSAGE.EMAIL_EXIST
                            });
                        } else {
                            commonService.encryptPassword(password, newPassword => {
                                const user = {
                                    userName: userName ? userName : "",
                                    userEmail: userEmail,
                                    password: newPassword ? newPassword : "",
                                    contactNo: contactNo ? contactNo : "",
                                    address_1: address_1 ? address_1 : "",
                                    address_2: address_2 ? address_2 : "",
                                    city: city ? city : "",
                                    state: state ? state : "",
                                    userType: userType ? userType : "",
                                    isDeleted: false
                                };

                                USER_COLLECTION.create(user, function (err, result) {
                                    if (err) {
                                        return res.send({ status: CONSTANT.FAIL, message: "", err: err });
                                    } else {
                                        return res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.REGISTER_SUCCESSFULLY, data: result });
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
Topic: Login User
*/

exports.loginUser = (req, res, err) => {
    const userEmail = req.body.userEmail
    const password = req.body.password
    if (commonService.isUndefinedOrNull(password) || commonService.isUndefinedOrNull(userEmail)) {
        return res.json({
            status: CONSTANT.FAIL,
            message: CONSTANT.MESSAGE.EMAIL_INVALID
        });
    } else {
        //check user is reister or not
        USER_COLLECTION.findOne({ userEmail: userEmail, isDeleted: false })
            .then(user => {
                if (user) {
                    commonService.decryptPassword(user.password, (decryptedpassword) => {
                        if (password == decryptedpassword) {
                            var userDetails = {
                                userName: user.userName,
                                userEmail: user.userEmail,
                                contactNo: user.contactNo,
                                address_1: user.address_1,
                                address_2: user.address_2,
                                city: user.city,
                                state: user.state,
                                userType: user.userType,
                                id: user.id
                            };
                            // create token for session
                            var token = jwt.sign(userDetails, "testing", {
                                expiresIn: 2592000  // expires in 30 days
                            });
                            return res.send({
                                status: CONSTANT.SUCCESS,
                                message: CONSTANT.MESSAGE.LOGIN_SUCESSFULLY,
                                data: userDetails,
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
Topic: update User
*/

exports.updateUserDetailsById = (req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const contactNo = req.body.contactNo;
    const address_1 = req.body.address_1;
    const address_2 = req.body.address_2;
    const city = req.body.city;
    const state = req.body.state
    const userType = req.body.userType;
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    }
    // else
    //  {
    //     if (!topicArea || !examTitle) {
    //         return res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    //     } 
    else {
        const userObj = {
            userName: userName,
            userEmail: userEmail,
            contactNo: contactNo,
            address_1: address_1,
            address_2: address_2,
            city: city,
            state: state,
            userType: userType,
        };
        USER_COLLECTION.findByIdAndUpdate(Id, { $set: userObj }, { new: true }, function (err, result) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            }
            res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.IS_UPDATED_SUCCESSFULLY, data: result });
        });
    }
    // }
}

/*
TODO: GET
Topic: get getAllUser
*/

exports.getAllUser = (req, res) => {
    const limit = (req.body.limit) ? req.body.limit : 20;
    const pageCount = (req.body.pageCount) ? req.body.pageCount : 0;
    var skip = (limit * pageCount);
    var totalRecords = 0;
    USER_COLLECTION.countDocuments({ isDeleted: false }).lean().exec(function (err, count) {
        totalRecords = count;
        USER_COLLECTION.find({ isDeleted: false }).sort({ name: 1 }).skip(skip).limit(limit).lean().exec(function (userOperatorError, user_operators) {
            if (userOperatorError || !user_operators) {
                res.json({
                    status: CONSTANT.FAIL,
                    message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND
                });
            } else {
                res.json({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.DATA_FOUND,
                    user_operators: user_operators,
                    totalRecords: totalRecords
                });
            }
        })
    })
};

/*
TODO: GET
Topic: get User ById
*/

exports.getUserById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        USER_COLLECTION.findById(Id).then(user => {
            if (user) {
                res.send({
                    status: CONSTANT.SUCCESS,
                    message: CONSTANT.MESSAGE.DATA_FOUND,
                    data: user
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

exports.deleteUserById = (req, res) => {
    const Id = req.params.id;
    if (!commonService.isValidObjId(Id)) {
        return res.send({
            status: CONSTANT.FAIL,
            message: CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.NOT_FOUND_BY_ID
        });
    } else {
        let myquery = { _id: Id };
        USER_COLLECTION.findByIdAndUpdate(myquery,{ $set: { isDeleted: true } },{ new: false },
            function (err, result) {
                if (err) {
                    res.send({ status: CONSTANT.ERROR, message: err });
                } else {
                    res.send({
                        status: CONSTANT.SUCCESS,
                        message:
                            CONSTANT.COLLECTION.USER + CONSTANT.MESSAGE.DELETE_SUCCESSFULLY
                    });
                }

            }
        );
    }
};

// Method: POST
// TODO: getPaginateUser
exports.getPaginateUser = (req, res) => {
    console.log("data",req.body);
    var page = req.body.page || 1;
    var limit = req.body.limit || 5;
    var query = {}
  var skip = limit * (page - 1)
  var limit = limit
  USER_COLLECTION.find({},{},function(err,data) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : "Employee founded", user: data};
            }
            res.json(response);
        }).skip(skip).limit(limit);
}