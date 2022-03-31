const mongoose = require("mongoose");

const paymentSchema  = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    phone : {
        type: Number,
        required:true,
        unique:true
    },
    books : {
        type: Object,
        required:true
    },
    totalprice : {
        type : Number,
        required:true
    },
    pincode : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    }
})

// we need to create collections

const Order = new mongoose.model("Order",paymentSchema);
module.exports = Order;