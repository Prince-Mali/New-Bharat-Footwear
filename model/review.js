const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    productId : {
        type : Schema.Types.ObjectId,
        ref : 'Product'
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    comment : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;