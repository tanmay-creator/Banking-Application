const mongoose = require("mongoose");

const bankSchema = mongoose.Schema({
    acno:{
    type:String,
        required:true
},
    first:{
        type:String,
        required:true
    },
    last:{
        type:String,
        required:true

    },
    balance:{
        type:Number,
        required:true
    }
})
const Bank = mongoose.model("customers",bankSchema);

module.exports = Bank;