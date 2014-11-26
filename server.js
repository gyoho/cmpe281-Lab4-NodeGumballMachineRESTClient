// BASE SETUP
var fs = require('fs');
var express = require('express');
var Client = require('node-rest-client').Client;
var port = process.env.PORT || 8080;

// CONFIGURE APP
var app = express();
app.use(express.bodyParser());
app.use("/images", express.static(__dirname + '/images'));


// START THE SERVER
app.listen(port);
