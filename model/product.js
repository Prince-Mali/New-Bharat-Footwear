const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        enum : ['Men', 'Women', 'Kids'],
        required : true
    },
    categories : {
        type : String,
        enum : ['sneakers', 'boots', 'sandals', 'loafer', 'sport shoes', 'flip-flops']
    },
    color : {
        type : String,
        required : true
    },
    size : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        default : 0,
        required : true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;