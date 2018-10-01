//api.js  application initialization

var express = require('express');
var api = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://karukola:123meghana@ds051851.mlab.com:51851/karukoladb');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
api.use(bodyParser.json())

// initialize advisor controller
var AdvisoryController = require('./advisoryController');
api.use('/api', AdvisoryController);

//error handling
api.use(function(err, req,res,next){
    console.log(err);
    res.status(422).send({error : err.message});

});

module.exports = api;