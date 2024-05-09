const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const fAQsSchema = mongoose.Schema({
    question: { type: String, default: CONSTANT.NULL_STRING },
    answer: { type: String, default: CONSTANT.NULL_STRING },
    status: { type: String, default: CONSTANT.NULL_STRING },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("fAQ", fAQsSchema)