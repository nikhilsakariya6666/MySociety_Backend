const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const UsersSchema = mongoose.Schema({
    userName: { type: String, default: CONSTANT.NULL_STRING },
    userEmail: { type: String, default: CONSTANT.NULL_STRING },
    password: { type: String, default: CONSTANT.NULL_STRING },
    contactNo: { type: String, default: CONSTANT.NULL_STRING },
    address_1: { type: String, default: CONSTANT.NULL_STRING },
    address_2: { type: String, default: CONSTANT.NULL_STRING },
    city: { type: String, default: CONSTANT.NULL_STRING },
    state: { type: String, default: CONSTANT.NULL_STRING },
    userType: { type: String, default: CONSTANT.NULL_STRING },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("user", UsersSchema)