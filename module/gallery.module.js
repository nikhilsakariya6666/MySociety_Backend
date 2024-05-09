const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const gallerysSchema = mongoose.Schema({
    image: { type: Array, default: [] },
    eventDate: { type: Date, default: CONSTANT.NUll_STRING },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("gallery", gallerysSchema)