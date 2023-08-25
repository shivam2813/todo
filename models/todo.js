const mongoose=require('mongoose');
const schema= mongoose.Schema;
const User=require('./user');

const todoSchema= new schema({
    task:{
        type:String,
        required:true,
    },
    user:{
        type:String,
        required:true,
    }
},{timestamps:true})

const todo=mongoose.model('Todo',todoSchema);
module.exports=todo;