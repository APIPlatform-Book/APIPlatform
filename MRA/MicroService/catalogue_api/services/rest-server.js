var express = require('express');
var bodyParser = require('body-parser');
var mongoose    =   require("mongoose");

function start(config, router) {

    //declare a variable app that inherit the functions available in express.
    var app = express();

    //the app is specified to accept JSON as the payload
    app.use(bodyParser.json());

    //each request is forwarded to the router class when called on http(s)//[Host]:[Port]/
    app.use("/", router);

    //the application listens on the server with port specified in the config file
    var server = app.listen(config.server.port);

    mongoose.Promise = global.Promise;

    var promise = mongoose.connect(config.db.connectString, {
      useMongoClient: true,
    }).catch(function(error) {
       console.log(error);
    });
}

module.exports.start = start;
