const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const ComplaintsSchema = mongoose.Schema({
    complaintType: { type: String, default: CONSTANT.NULL_STRING },
    description: { type: String, default: CONSTANT.NULL_STRING },
    createdBy: { type: String, default: CONSTANT.NULL_STRING },
    complaintUserId: { type: String, default: CONSTANT.NULL_STRING },
    complaintDate: { type: Date, default: CONSTANT.NULL_STRING },
    remark: { type: String, default: CONSTANT.NULL_STRING },
    resolvedDate: { type: Date, default: CONSTANT.NULL_STRING },
    status: { type: String, default: CONSTANT.NULL_STRING }, //Check it Default value sir pase check karavi
    isDeleted: { type: String, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("complaint", ComplaintsSchema)