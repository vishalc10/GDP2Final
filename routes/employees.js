const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const config = require('../config/database');

//Register
router.post('/register', function(req, res, next) {
    var newEmployee = new Employee(req.body);
    Employee.insertEmployee(newEmployee, (err, event) => {
            if(err){console.log('this is error', err)
                return res.json({success: false, msg: 'Event already exists'});
            } else {
                return res.json({success: true, msg: 'Succeed to register event'});
            }
        });
});

//Update
router.post('/update', function(req, res, next) {
    var updateEmployee = new Employee(req.body);
    Employee.updateEmployee(updateEmployee, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'failed to update event'});
        } else {
            return res.json({success: true, msg: 'Succeed to update event'});
    }
    })
});

//Delete
router.post('/delete', (req, res, next) => {
    Employee.deleteEmployee({_id: req.body._id}, (err, user) => {
        if(err){
            return res.json({success: false, msg: 'failed to delete event'});
        } else {
            return res.json({success: true, msg: 'Succeed to delete event'});
        }
    })
});

//Read All Data
router.get('/getAllEmployees', function(req, res, next) {
    Employee.find(function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
});

//Read employee Data by ID
router.get('/getEmployee', function(req, res, next) {

    if(req.query.emplyeeid){
        Employee.getEmployeeById(req.query.emplyeeid, function (err, employee) {
            if (err) return next(err);
            res.json(employee);
        });
    }
});
//Read Events Data like param
router.get('/search', function(req, res, next) {

    var queryCond = {};
    if(req.query.strparams){
        queryCond.$or = [{firstname:{$regex: '.*' + req.query.strparams + '.*'}},{lasttname:{$regex: '.*' + req.query.strparams + '.*'}},
            {email:{$regex: '.*' + req.query.strparams + '.*'}}];
    }
    if(req.query.category){
        queryCond.$and = [{category: req.query.category}];
    }
    if(req.query.status){
        queryCond.$and = [{status: req.query.status}];
    }
    Employee.find(queryCond, function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
});

module.exports = router;