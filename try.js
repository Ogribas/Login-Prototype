const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const url = 'mongodb+srv://ogribas:saya123@login-prototype.drxub0o.mongodb.net/';

const store = new MongoDBStore({
  uri: url,
  collection:'session',
  expires: 10000
}) 

app.use(session({
  secret:'secret',
  saveUninitialized: false,
  resave: false,
  store
}))

app.get('/',(req,res)=>{
  res.redirect('/home')
})

app.get('/home',(req,res)=>{
  req.session.nama = `Darren`;
  res.send(`Session dengan nama Darren Telah dibuat <3`);
})



app.get('/check', async (req, res) => {
  store.get(req.session.id,(e,d)=>{
    try {
      res.send(`Halo ${d.nama}, Selamat datang di website kami`)
    } catch (error) {
      res.redirect('/home')
    }
   })
 });




mongoose.connect(url).then((r)=>{
  console.log(`Mongo DB connected`)
})

app.listen(3000,(req,res)=>{
  console.log(`App running on: 3000`)
})