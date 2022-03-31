var mongoose = require('mongoose');


var cartSchema = new mongoose.Schema({ 
    useremail: {
        type: String,
        required: true
    },
    imagePath: {
        type: String, 
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
});

const Cart = new mongoose.model("Cart",cartSchema);
module.exports = Cart;