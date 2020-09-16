const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: {
        type: String, 
        required: true, 
        unique: true, 
        match: /[^-\s]/
    }
    ,email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String,
         required: true
        , match : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/
    },
    firstName: {
            type: String,
         required: true
    },
    lastName: {
            type: String,
         required: true
    },
    avatarImage: { type: String
    }
});

module.exports = mongoose.model('User', userSchema);