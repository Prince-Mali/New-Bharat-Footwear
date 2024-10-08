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
        // required : true
    },
    size : {
        type : Number,
        // required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
