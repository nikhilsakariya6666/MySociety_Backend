const mongoose = require("mongoose")
const CONSTANT = require("../common/constant")

const expenseIncomesSchema = mongoose.Schema({
    societyId: { type: String, default: CONSTANT.NUll_STRING },
    shortDescription: { type: String, default: CONSTANT.NUll_STRING },
    longDescription: { type: String, default: CONSTANT.NUll_STRING },
    amount: { type: String, default: CONSTANT.NUll_STRING },
    debitAmount : {type : String , default:CONSTANT.NUll_STRING},
    creditAmount : {type:String,default:CONSTANT.NUll_STRING},
    isDebit: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("expenseIncome", expenseIncomesSchema)