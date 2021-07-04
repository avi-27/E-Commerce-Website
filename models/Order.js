const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/mso2",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const oSchema = mongoose.Schema({
    uname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    imodel:{
        type:String,
        required:true
    }
})


const oModel = mongoose.model('order',oSchema)

module.exports = oModel