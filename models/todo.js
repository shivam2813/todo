const mongoose=require('mongoose');
const user = require('../models/user')
const schema= mongoose.Schema;

const todoSchema= new schema({
    task:{
        type:String,
        required:true,
    },
    user:
    {
        type:schema.Types.ObjectId, 
        ref:user, 
        required:true
    },
},{timestamps:true})

const todo=mongoose.model('TODO',todoSchema);
module.exports=todo;