const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const multer = require('multer');
const DIR = './uploads/';
const upload = multer({dest: DIR}).single('photo');
const async = require('async');
const crypto = require('crypto');


//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        username: req.body.username,
        password:req.body.password,
        phone: req.body.phone,
        status: req.body.status,
        em:req.body.em,
        bi:req.body.bi,
        rm:req.body.rm,
        sm:req.body.sm,
        s:req.body.s,
        role: req.body.role
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'Username or Email already exists'});
        } else {
            return res.json({success: true, msg: 'Succeed to register user'});
        }
    })
});

//Update
router.post('/update', (req, res, next) => {
    let newUser = new User({
        _id: req.body._id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        street: req.body.street,
        street2: req.body.street2,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        photo: req.body.photo
    });
    User.updateUser(newUser, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'failed to update profile'});
        } else {
            return res.json({success: true, msg: 'Succeed to update profile'});
        }
    })
});

//Update Password
router.post('/updatePassword', (req, res, next) => {
    let newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    // console.log(newUser);
    User.changePassword(newUser, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'failed to update profile'});
        } else {
            return res.json({success: true, msg: 'Succeed to update profile'});
        }
    })
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT '+ token,
                    user: {
                        id: user._id,
                        username: user.username,
                        password: password,
                        role: user.role
                    }
                });
            } else {
                return res.json({success:false, msg: 'Invalid Username and Password. Please try again.'});
            }
        });
    });
});

//Send Verification Link when User forgot the password
router.post('/verificationlink', (req, res, next) => {
    const username = req.body.username;
    async.waterfall([
        function(done) {
            User.findOne({
                username: username
            }).exec(function(err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('User not found.');
                }
            });
        },
        function(user, done) {
            // create the random token
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function(user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 7200000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                done(err, token, new_user);
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'usergmail.com',
                    pass: 'gmailpassword'
                }
            });
            var reflink = 'http://localhost:4200/resetPassword?token=' + token;
            var data = {
                from: 'Mozingo EMS',
                to: user.email,
                subject: 'Sending Email Password Reset',
                text: 'Hi, ' + user.username,
                html: 'Dear, <strong> ' + user.username + '</strong><br><br> Please click on the link bellow to set your new password.<br>' +
                    'Password reset time will be close after 2 hours.' +
                '<br><br><a href=' + reflink +'>Click Here!</a>'
            };

            smtpTransport.sendMail(data, function(err) {
                if (err) {
                    return res.json({success: false, msg: err});
                } else {
                    return res.json({success:true, msg: 'Email was sent to your Email address', user: user});
                }
            });
        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
});

//Change user password
router.post('/changepassword', (req, res, next) => {
    let newUser = new User({        
        username: req.body.username,
        password:req.body.password       
    });
    console.log(newUser);
    User.changePassword(newUser, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'Something went wrong'});
        } else {
            return res.json({success: true, msg: 'Password changed successfully', user: user});
        }
    })
});

//Inactivate User
router.post('/changeStatus', (req, res, next) => {
    let newUser = new User({        
        username: req.body.username,
        status: req.body.status
    });

    User.changeStatus(newUser, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'Something went wrong'});
        } else {
            return res.json({success: true, msg: 'Inactivated successfully', user: user});
        }
    })
});

//upload Image
router.post('/uploadImage', (req, res, next) => {

    var path = '';

    upload(req, res, function(err) {
        
        if(err) {
            // An error occurred when uploading
            console.log(err);
            return res.status(422).send("an Error occured");
        }

        // No error occured
        path = req.file.path;

        return res.send("Upload Completed for " + path);
    });
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res, next) {
    res.json({user: req.user});    
});

//Read Users Data
router.get('/activeuser', function(req, res, next) {
    const filter = {status: true};
    User.find(filter, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

router.get('/inactiveuser', function(req, res, next) {
    const filter = {status: false};
    User.find(filter, function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

//Read Users Data like param
router.get('/search', function(req, res, next) {
    const filter = {username: { $regex: '.*' + req.query.strparams + '.*' }, status: req.query.status};
    User.find(filter, function (err, users) {
        if (err) return next(err);
        res.json(users);
    });
});

module.exports = router;