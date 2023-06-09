const mongoose = require('mongoose');

const User = new mongoose.Schema ({
    firstName: String,
    secondName: String,
    email: {
        type: String,
        unique: true,
    },
    passWord: {
        type: String,
        required: true,
    }
})



module.exports  = mongoose.model('UserData', User);

//console.log(model.prototype)

