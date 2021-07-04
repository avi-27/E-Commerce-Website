const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/mso2",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const sSchema = mongoose.Schema({
    iname:{
        type:String,
        required: true
    },
    quantity:{
        type:Number
    }
})

const sModel = mongoose.model('stock',sSchema)

module.exports = sModel