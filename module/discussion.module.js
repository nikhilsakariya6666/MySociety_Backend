const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const discussionsSchema = mongoose.Schema({
    topic: { type: String, default: CONSTANT.NUll_STRING },
    discussionDate: { type: Date, default: CONSTANT.NUll_STRING },
    societyId: { type: String, default: CONSTANT.NUll_STRING },
    startDate: { type: Date, default: CONSTANT.NUll_STRING },
    endDate: { type: Date, default: CONSTANT.NUll_STRING },
    comment: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("discussion", discussionsSchema)