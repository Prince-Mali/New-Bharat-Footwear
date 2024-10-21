const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    items : [
        {
            product : {
                type : Schema.Types.ObjectId,
                ref : 'Product'
            },
            quantity : {
                type : Number,
                default : 1
            },
            price : {
                type : Number
            }
        }
    ],
    totalQuantity : {
        type : Number,
        default : 0
    },
    totalPrice : {
        type : Number,
        default : 0
    },
    address : {
        name : {type : String, required : true},
        contact : {type : String, required : true},
        street : {type : String, required : true},
        city : {type : String, required : true},
        state : {type : String, required : true},
        pincode : {type : String, required : true}
    },
    paymentMethod : {
        type : String,
        enum : ['cash_on_delivery', 'credit_card', 'debit_card'],
        required : true
    },
    orderStatus : {
        type : String,
        default : 'Pending'
    },
    date : {
        type : Date,
        default : Date.now()
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;