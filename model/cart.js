const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
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
                type : Number,
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
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
