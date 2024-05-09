const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const EventsSchema = mongoose.Schema({
    eventName: { type: String, default: CONSTANT.NULL_STRING },
    description: { type: String, default: CONSTANT.NULL_STRING },
    note: { type: String, default: CONSTANT.NULL_STRING },
    startDate: { type: Date, default: CONSTANT.NULL_STRING },
    endDate: { type: Date, default: CONSTANT.NULL_STRING },
    societyId: { type: String, default: CONSTANT.NULL_STRING },
    address: { type: String, default: CONSTANT.NULL_STRING },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("event", EventsSchema)