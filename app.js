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
const User = require('./models/user');
const Todo=require('./models/todo');


const dburi='mongodb+srv://shivam1313:87654321@todo.gjbhb1k.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dburi,{ useNewUrlParser:true ,useUnifiedTopology:true })
    .then((result)=>{
        app.listen(3002);
    })
    .catch((err)=>{
        console.log(err);
    })


app.use(session({
    secret:'12abcshivam',
    resave:true,
    saveUninitialized:true,
}))

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) return done(err);
                if (result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        })
        .catch(err => done(err));
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


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

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',(req,res)=>{
    const {email , password}=req.body

    bcrypt.hash(password,10)
    .then(hash=>{
        const user = new User({
            email:email,
            password:hash,
        })
        return user.save();
    })
    .then(user=>{
        res.redirect('/login')
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/register')
    })
})


app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}))

app.get('/logout',(Req,res)=>{
    req.logout();
    res.redirect('/login');
})

function ensureAuthenticated(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login');
}

app.get('/protected',ensureAuthenticated,(req,res)=>{
    res.render('protected');
})

app.post('/',(req,res)=>{
    const {task} = req.body;
    console.log(req.body);
    const todo= new Todo({
        task:task,
        user:req.user.id,
    })
    
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
