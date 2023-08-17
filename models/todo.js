const mongoose=require('mongoose');
const schema= mongoose.Schema;

const todoSchema= new schema({
    task:{
        type:String,
        required:true,
    },
    user:{type:Schema.Types.objectId, ref:'User', required:true},
},{timestamps:true})

const todo=mongoose.model('TODO',todoSchema);
module.exports=todo;