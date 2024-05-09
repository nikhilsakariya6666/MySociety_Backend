const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const PositiveThoughtsSchema = mongoose.Schema({
    description: { type: String, default: CONSTANT.NULL_STRING },
    date: { type: Date, default: CONSTANT.NULL_STRING },
    societyId: { type: String, default: CONSTANT.NULL_STRING },
    isDeleted: { type: String, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("positiveThought", PositiveThoughtsSchema)