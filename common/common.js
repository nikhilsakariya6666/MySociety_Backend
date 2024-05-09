require("dotenv").config();
var mongodb = require("mongodb");

const CONSTANT = require("./constant");
const ALGO = process.env.ALGO;
const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
const crypto = require("crypto");

exports.isUndefinedOrNull = _isUndefinedOrNull;
exports.isObjEmpty = _isObjEmpty;
exports.isArrEmpty = _isArrEmpty;
exports.isValidObjId = _isValidObjId;
exports.encryptPassword = _encryptPassword;
exports.decryptPassword = _decryptPassword;
exports.validateEmail = _validateEmail;

//Check Undefined and null value
function _isUndefinedOrNull(value) {
  if (typeof value == CONSTANT.UNDEFINED || value == null || value == "") {
    return true;
  } else {
    return false;
  }
}

//validation Email expression
function _validateEmail(userEmail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)) {
    return (true)
  }
  return (false)
}

//encrypt Password
function _encryptPassword(value, callback) {
  let iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv(ALGO, Buffer.from(ENCRYPT_KEY), iv)
  let encrypted = cipher.update(value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  callback(iv.toString("hex") + ":" + encrypted.toString("hex"))
}

//decrypt Password
function _decryptPassword(value, callback) {
  let values = value.split(":")
  let iv = Buffer.from(values.shift(), 'hex')
  let encryptedValue = Buffer.from(values.join(":"), 'hex')
  let decipher = crypto.createDecipheriv(ALGO, Buffer.from(ENCRYPT_KEY), iv)
  let decrypted = decipher.update(encryptedValue);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  callback(decrypted.toString())
}

/*
TYPE:GET
To array is undefined or null or empty.
*/
function _isArrEmpty(arr) {
  return (arr == null || typeof arr === "undefined" || arr.length <= 0)
}

/*
TYPE:GET
To value is undefined or null.
*/
function _isObjEmpty(obj) {
  return obj == null || typeof arr == "undefined" || Object.keys(obj).length <= 0;
}

/*
TYPE:GET
To check id is valid or not.
*/
function _isValidObjId(id) {
  if (!_isUndefinedOrNull(id)) {
    return mongodb.ObjectID.isValid(id);
  } else {
    return false;
  }
}