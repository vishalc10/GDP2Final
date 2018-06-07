const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const employee = require('./employee');
var Schema = mongoose.Schema;
const EventSchema = mongoose.Schema({
    // _id: Schema.Types.ObjectId,
    eventname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    starttime: {
        type: String
    },
    endtime: {
        type: String
    },
    alldayF: {
        type: Boolean
    },
    notes: {
        type: String,
        required: true
    },
    employees: [{ type: Schema.Types.ObjectId, ref: employee }]
});

const Event = module.exports = mongoose.model('events', EventSchema);

module.exports.insertEvent = function(newEvent, callback){
    newEvent.save(callback);
};

module.exports.updateEvent = function(updateEvent, callback){
    Event.update({ _id: updateEvent._id }, updateEvent, callback);
};

module.exports.deleteEvent = function(deleteEvent_id, callback){
    Event.deleteOne({ _id: deleteEvent_id }, callback);
};

module.exports.getEventById = function(id, callback){
    Event.findOne({ _id: id }, callback);
};

module.exports.findAll = function(callback){
    Event.find().exec(callback);
};