const express=require('express');
const mongoose=require('mongoose');
const { render }=require('ejs');
const { urlencoded } = require('express');
const passport=require('passport');
const session= require('express-session');
const  LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash= require('connect-flash');

const app=express();
const user=require('./models/user');
const Todo=require('./models/todo');

const dburi='mongodb+srv://shivam1313:87654321@todo.gjbhb1k.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dburi,{ useNewUrlParser:true ,useUnifiedTopology:true })
    .then((result)=>{
        app.listen(3002);
    })
    .catch((err)=>{
        console.log(err);
    })


app.set('view engine','ejs');
app.use(urlencoded());
app.use(express.static('public'));

app.get('/',(req,res)=>{
    Todo.find().sort().
    then((result)=>{
        console.log("Todos: ", result);
        res.render('index',{todos:result});
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post('/',(req,res)=>{
    console.log(req.body);
    const todo= new Todo(req.body)
    
    todo.save()
    .then((result)=>{
        res.redirect('/');
    })
    .catch((err)=>{
       console.log(err);
    })
})

app.delete('/:id',(req,res)=>{
    const id=req.params.id;

    Todo.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect : '/'})
    })
    .catch((err)=>{
        console.log(err);
    })
})
