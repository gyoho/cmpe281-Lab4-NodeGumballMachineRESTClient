// BASE SETUP
// file system module is built into nodeJs
var fs = require('fs');
var express = require('express');
var Client = require('node-rest-client').Client;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;


// configure app to use the packages we pulled in using npm
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use("/images", express.static(__dirname + '/images'));


// =====================================================================

// Anonymous Function Expression
var page = function(req, res, state) {
	body = fs.readFileSync('./index.html');
	res.setHeader('Content-Type', 'text/html');
	res.writeHead(200);

	// use node-rest-client to access the RESTful grails service
	var client = new Client();
	// Closure + Anonymous Function
	client.get("http://yaopeng-grails-gumballmachine-v2.cfapps.io/gumballs/1", function(data, res_raw){

        /**
        Domain: class Gumball
            String modelNumber
            String serialNumber
            Integer countGumballs
        ...
        **/

		var count = data.countGumballs;
		console.log("count = " + count);
		var msg = "\nMighty Gumball, Inc.\nNodeJS-Enabled Standing Gumball\n" + "Model# "
                    + data.modelNumber + "\nSerial# " + data.serialNumber + "\n\n" + "---------------------------\n\n"
			+ "State: " + state;

		// Shoves in the content into the HTML page
		var html_body = "" + body;
		html_body = html_body.replace("{message}", msg);
		html_body = html_body.replace(/id="state".*value=".*"/, "id=\"state\" value=\"" + state + "\"");
		res.end(html_body);
	});
}



var order = function(req, res) {
    var client = new Client();
    var count = 0;

    client.get("http://yaopeng-grails-gumballmachine-v2.cfapps.io/gumballs/1", function(data, res_raw){
        console.log("node-rest-client is accessing the grails RESTful service");

        console.log("Request body in order:");
        console.log(data);
        console.log("Response body in order:");
        console.log(res_raw);


        var count = data.countGumballs;
        console.log("count before = " + count);
        if(count > 0) {
            count--;
        }
        console.log("count after = " + count);
        var args = {
            data: {countGumballs: count},
            headers: {"Content-Type": "application/json"}
        };
        client.put("http://yaopeng-grails-gumballmachine-v2.cfapps.io/gumballs/1", args, function(req, res_raw){
            page(req, res, "no-coin")
        });
    });
}


var handle_get = function (req, res) {
	console.log("GET called...");
	page(req, res, "no-coin");
}


var handle_post = function(req, res) {
    console.log("\nPost:");
    console.log("Action: " + req.body.event);
    console.log("State: " + req.body.state);

    var action = "" + req.body.event;
    var state = "" + req.body.state;

    if(action == "Insert Quarter") {
        console.log("A quarter inserted");
        if(state == "no-coin") {
            page(req, res, "has-coin");
            console.log("Turn crank and get a gumball");
        }
        else {
            console.log("You already inserted a quarter");
            page(req, res, state);
        }
    }
    else if(action == "Turn Crank") {
        if(state == "has-coin") {
            console.log("A gumball is rolling out");
            // console.log("Request body in handle_post:");
            // console.log(req);
            // console.log("Response body in handle_post:");
            // console.log(res);

            order(req, res);
        }
        else {
            console.log("You need to insert a quarter first");
            page(req, res, state);
        }
    }
}


app.get("*", handle_get);
app.post("*", handle_post);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api



// START THE SERVER
app.listen(port, ip);
console.log('Server running at http://'+ip+':'+port+'/');
