const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Event Schema

const EmployeeSchema = mongoose.Schema({
    employeeID: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lasttname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipcode: {
        type: Number
    },
    ProfilePicture: {
        type: String
    },
    PhoneNumber: {
        type: Number
    },
    WorkHoursPerWeek: {
        type: Number
    },
    StandardHours_Month: {
        type: Number
    },
    DateOfBirth: {
        type: Date
    },
    category: {
        type: String
    },
    status: {
        type: String
    }
});

const Employee = module.exports = mongoose.model('employees', EmployeeSchema);

module.exports.insertEmployee = function(newEmployee, callback){
    newEmployee.save(callback);
};

module.exports.updateEmployee = function(updateEmployee, callback){
    Employee.update({ _id: updateEmployee._id }, updateEmployee, callback);
};

module.exports.deleteEmployee = function(deleteEmployee_id, callback){
    Employee.deleteOne({ _id: deleteEmployee_id }, callback);
};

module.exports.getEmployeeById = function(id, callback){
    Employee.findOne({ _id: id }, callback);
};