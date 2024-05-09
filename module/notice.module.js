const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const noticesSchema = mongoose.Schema({
    note: { type: String, default: CONSTANT.NULL_STRING },
    societyId: { type: String, default: CONSTANT.NULL_STRING },
    date: { type: Date, default: CONSTANT.NULL_STRING },
    noticeType: { type: String, default: CONSTANT.NULL_STRING },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("notice", noticesSchema)