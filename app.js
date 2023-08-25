const express=require('express');
const mongoose=require('mongoose');
const { render }=require('ejs');
const { urlencoded } = require('express');

const app=express();
const Todo=require('./models/todo')
const User=require('./models/user')

const dburi='mongodb+srv://shivam:shivam123@todo.gjbhb1k.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dburi,{ useNewUrlParser:true ,useUnifiedTopology:true })
    .then((result)=>{
        app.listen(3002);
    })
    .catch((err)=>{
        console.log(err);
    })


app.set('view engine','ejs');
app.use(express.urlencoded());
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('login');
})

app.get('/index',(req,res)=>{
    var userId=req.query.userId;
    Todo.find({user:userId}).sort({ createdAt:-1 }).
    then((result)=>{
        res.render('index',{todos:result,user:userId});
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get('/register',(req,res)=>{
    res.render('register');
})
app.get('/logout',(req,res)=>{
    res.render('login');
})


app.post('/index',(req,res)=>{
    // console.log(req.body);
    const {task, userId}=req.body;
    const todo= new Todo({
        task:task,
        user:userId,
    });
    
    todo.save()
    .then((result)=>{
        res.redirect(`/index?userId=${userId}`);
    })
    .catch((err)=>{
       console.log(err);
    })
})

app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    User.findOne({email:email}).then((user)=>{
        if(user)
        {
            if(user.password === password)
            {
                res.redirect(`/index?userId=${user._id}`);
            }
            else{
                res.redirect('/');
            }
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post('/register',(req,res)=>{
    const user=new User(req.body);
    user.save()
    .then((result)=>{
        res.redirect('/');
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.delete('/index/:id',(req,res)=>{
    const id=req.params.id;
    const user=req.query.userId;
    Todo.findByIdAndDelete(id)
    .then((result)=>{
        res.json({redirect : `/index?userId=${user}`})
    })
    .catch((err)=>{
        console.log(err);
    })
})
