const mongoose = require('mongoose');
const url = `mongodb+srv://ogribas:saya123@login-prototype.drxub0o.mongodb.net/`;

mongoose.connect(url)
.then(r=>{
    console.log(`MongoDB Successfully Connected`)
}).catch(e=>{
    console.log(`Error`)
})

const User = new mongoose.model('User',{
    username:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports = {User};