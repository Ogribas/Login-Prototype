// NPM Modules
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const {User} = require('./data/db');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

// Store Config
const store = new MongoDBStore({
    uri: 'mongodb+srv://ogribas:saya123@login-prototype.drxub0o.mongodb.net/',
    collection: 'session',
    expires:60000
})

// View Engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:'secret',
    saveUninitialized: false,
    resave: false,
    store
}))
app.use(flash());

// Route

// Root
app.get('/',(req,res)=>{
    res.redirect(`/login`);
})

// Home
app.get('/login',(req,res)=>{
    res.render('login.ejs',{msg:req.flash('msg')});
})

// POST Login
app.post('/login',async (req,res)=>{
    await User.findOne({username: req.body.username})
    .then(async ()=>{
        const userdbPassword = await User.findOne({username: req.body.username}).then((user)=>{return user.password});

        bcrypt.compare(req.body.password, userdbPassword).then(async (isMatch)=>{
            if(!isMatch){
                req.flash('msg','Password anda salah');
                console.log(`Password anda salah`)
                res.redirect('/login')
            }
            else{
                const userId = await User.findOne({username:req.body.username}).then((user)=>{return user._id});
                req.session.isAuth = userId.toString();
                console.log(userId.toString());
                res.redirect('/home');
            }
        })
    })
    .catch(async()=>{
        req.flash('msg','Salah menginput username');
        console.log('Salah menginput username');
        res.redirect('/login')
        
    })
    
   
})

// app.post('/login',async (req,res)=>{
//     if(await User.findOne({username: req.body.username})){
//         const userdbPassword = await User.findOne({username: req.body.username}).then((user)=>{return user.password});
//         if(!bcrypt.compare(req.body.password, userdbPassword)){
//             console.log(`Password anda salah`)
//         }else{
//             const userId = await User.findOne({username:req.body.username}).then((user)=>{return user._id});
//             req.session.isAuth = userId.toString();
//             console.log(userId.toString());
//             res.redirect('/home');
//         }
//     }else{
//         console.log('Anda belum register');
//         res.redirect('/login')
//     }
// })

// Register
app.get('/register',(req,res)=>{
    res.render('register.ejs',{msg:req.flash('msg')});
})

// POST Register
app.post('/register',async (req,res)=>{
    const newUser = await new User({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
    })

    try {
        if(await User.findOne({username: req.body.username})){
            throw new Error (`Gagal Login,  Username telah diambil`)
        }
        if(req.body.password !== req.body.password1){
            throw new Error (`Password anda tidak sama`)
        }

        await newUser.save();
        req.flash('msg','Anda telah berhasil Register')
        console.log(`${newUser.username}, Telah Berhasil Register`)

        res.redirect('/login');

    } catch (error) {
        req.flash('msg',error.message);
        console.log(`Gagal Login, Username telah diambil`)
        res.redirect('/register')
    }
   

})

// Home
app.get('/home',async (req,res)=>{
    await store.get(req.session.id,async (e,d)=>{
        if(e || !d || !d.isAuth || !req.session){
            res.redirect('/login')
        }else if (req.session.isAuth !== d.isAuth){
            res.redirect('/login')
        }else{
            const user = await User.findOne({_id: req.session.isAuth});
            console.log(user);
            res.render('home.ejs',{user})
        }
    })
    
})

// Logout
app.post('/logout',(req,res)=>{

    store.destroy(req.session.id,(e)=>{
        if(e){
            console.log(`Error woi`)
        }else{
            req.session.destroy();
            res.redirect('/login');
        }
    })
   


})

// Localhost Destination
app.listen(3000,(req,res)=>{
    console.log(`App listening on port: 3000`)
})
