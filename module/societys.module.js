const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const SocietysSchema = mongoose.Schema({
    societyName: { type: String, default: CONSTANT.NULL_STRING },
    societyEmail: { type: String, default: CONSTANT.NULL_STRING },
    password: { type: String, default: CONSTANT.NULL_STRING },
    address: { type: String, default: CONSTANT.NULL_STRING },
    contactUserId: { type: String, default: CONSTANT.NULL_STRING },
    contactUserContactNo: { type: String, default: CONSTANT.NULL_STRING },
    initialCapital: { type: String, default: CONSTANT.NULL_STRING },
    totalBalance: { type: String, default: CONSTANT.NULL_STRING },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("society", SocietysSchema)