const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    discription : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true,
        enum : ['Men', 'Women', 'Kids']
    },
    imageUrl : {
        type : String,
        required : true
    },
    color : {
        type : String,
        default : 'black'
    },
    size : {
        type : Number,
        required : true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
