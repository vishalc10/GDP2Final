const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Event = require('../models/event');
const config = require('../config/database');

//Register
router.post('/register', function(req, res, next){
    // let newEvent = new Event({
    //     eventname: req.body.eventname,
    //     alldayF: req.body.alldayF,
    //     location: req.body.location,
    //     startdate: req.body.startdate,
    //     enddate: req.body.enddate,
    //     starttime: req.body.starttime,
    //     endtime: req.body.endtime,
    //     username: req.body.username,
    //     notes: req.body.notes
    // });
var newEvent = new Event(req.body);
    // console.log(newEvent);
    Event.insertEvent(newEvent, (err, event) => {
        if(err){console.log('this is error', err)
            return res.json({success: false, msg: 'Event already exists'});
        } else {
            return res.json({success: true, msg: 'Succeed to register event'});
        }
    });
});

//Update
router.post('/update', function(req, res, next){
    let newEvent = new Event({
        _id: req.body._id,
        eventname: req.body.eventname,
        alldayF: req.body.alldayF,
        location: req.body.location,
        startdate: req.body.startdate,
        enddate: req.body.enddate,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
        username: req.body.username,
        notes: req.body.notes
    });
    Event.updateEvent(newEvent, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'failed to update event'});
        } else {
            return res.json({success: true, msg: 'Succeed to update event'});
        }
    })
});

//Delete
router.post('/delete', (req, res, next) => {
    Event.deleteEvent({_id: req.body._id}, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'failed to delete event'});
        } else {
            return res.json({success: true, msg: 'Succeed to delete event'});
         }
    })
});

//Read All Events Data
router.get('/getAllEvents', function(req, res, next) {
    Event.findAll(function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
});

//Read Event Data by ID
router.get('/getEvent', function(req, res, next) {

    if(req.query.eventid){
        Event.getEventById(req.query.eventid, function (err, event) {
            if (err) return next(err);
            res.json(event);
        });
    }
});

//Read Events Data like param
router.get('/search', function(req, res, next) {
    const filter = {eventname: { $regex: '.*' + req.query.strparams + '.*' }};
    Event.find(filter, function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
});

module.exports = router;