const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const visitorSchema = new Schema({
    visitorCount : {
        type : Number,
        default : 0
    }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
