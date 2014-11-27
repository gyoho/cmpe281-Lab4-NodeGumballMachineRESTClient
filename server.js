// BASE SETUP
var fs = require('fs');
var express = require('express');
var Client = require('node-rest-client').Client;
var port = process.env.PORT || 8080;


// configure app to use the packages we pulled in using npm
var app = express();
app.use(express.bodyParser());
app.use("/images", express.static(__dirname + '/images'));


// =============================================================================
var router = express.Router();

// accessed at GET http://localhost:8080/api
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
