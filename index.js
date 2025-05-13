const express=require('express');
const mongoose=require('mongoose');
const path = require('path');
const cookieParser=require('cookie-parser');
const blogModel=require('./models/blogPost');
const userModel=require('./models/user');
const { copyFileSync } = require('fs');
const { runInNewContext } = require('vm');
app=express();


//
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.get('/',(req,res)=>{
    res.render('welcome')
})

mongoose.connect('mongodb://127.0.0.1:27017/blogHai')
app.get('/signup',(req,res)=>{
   res.render('signUp');   
})
app.post('/signup',async(req,res)=>{
    
    const { username,email,password } = req.body;
    const existingUser= await userModel.findOne({username});
    const existingEmail= await userModel.findOne({email});
    if(existingUser || existingEmail){
        return res.status(400).send('User already exists. Please use a different UserName.');
    }
    const createdUser= await userModel.create({
        username,
        email,
        password
    })
    res.cookie('username',username);

    console.log("your cookie before to redirect:",req.cookies.username);

    res.redirect('/dashboard');
    console.log("your cookie ater redirect:",req.cookies.username);
    console.log("hi this is priyanshu")
   
})

app.get('/signin',(req,res)=>{
    res.render('signIn');
})
app.post('/signin',async(req,res)=>{
    const {username,password } = req.body;
    const isUserExist= await userModel.findOne({username});
    const isPassword=await userModel.findOne({password});
    if(!isUserExist){
         return res.status(400).send('User not exist first create account. Incorrect userName');
    }
    if(!isPassword){
        return res.status(400).send('Password incorrect.');
    }
    res.cookie('username',username);
    res.redirect('/dashboard');
})

app.get('/dashboard',(req,res)=>{
    const username = req.cookies.username || 'Guest';
    console.log("cookie in the dashboard:",username);
    res.render('dashboard',{username})
})

app.post('/logout',(req,res)=>{
    res.clearCookie('username');
    res.redirect('/');
})

app.get('/createPost',(req,res)=>{
    res.render('createPost')
})

app.post('/createPost', async (req,res)=>{
    const {title,content}=req.body;
    
    const postData= await blogModel.create({
        title,
        content
    })
    res.redirect('/dashboard');
})
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});