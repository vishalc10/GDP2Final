const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Event = require('./event');
var Schema = mongoose.Schema;
// User Schema

const UserSchema = mongoose.Schema({
    _id: Schema.Types.ObjectId,
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    street: {
        type: String
    },
    street2: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipcode: {
        type: String
    },
    photo: {
        type: String
    },
    status: {
        type: Boolean
    },
    em: {
        type: Boolean
    },
    bi: {
        type: Boolean
    },
    rm: {
        type: Boolean
    },
    sm: {
        type: Boolean
    },
    s: {
        type: Boolean
    },
    role: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    reset_password_token: {
        type: String
    },
    reset_password_expires: {
        type: Date
    },
    events: [{ type: Schema.Types.ObjectId, ref: Event }]
});

const User = module.exports = mongoose.model('users', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}


module.exports.updateUser = function(newUser, callback){
    User.update(
        { username: newUser.username },
        {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            phone: newUser.phone,
            street: newUser.street,
            street2: newUser.street2,
            city: newUser.city,
            state: newUser.state,
            zipcode: newUser.zipcode,
            photo: newUser.photo
        },
        { new: true },
        callback
    );
}

module.exports.changePassword = function(newUser, callback){
    const query = {username: newUser.username};
    const options ={new: true};
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            User.findOneAndUpdate(query, { password: hash }, options, callback);
        });
    });
}

module.exports.changeStatus = function(newUser, callback){
    const filter = {username: newUser.username};
    const options ={new: true};
    User.findOneAndUpdate(filter, { status: newUser.status }, options, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.search = function(strparam, callback){
    User.find({username: { $regex: '.*' + strparam + '.*' }}, callback);
}