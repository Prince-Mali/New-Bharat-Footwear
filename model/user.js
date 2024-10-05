const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    contact : {
        type : Number,
    },
    address : {
        type : String,
    },
    image : {
        type : String,
        default : 'https://res.cloudinary.com/dp7o3qopm/image/upload/v1728058954/profile_ldhtrc.jpg'
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;