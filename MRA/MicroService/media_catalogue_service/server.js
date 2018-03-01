var server  =   require("./services/rest-server.js");
var config  =   require("./config/config.js");
var data    =   require("./data/cataloguedb.js");
var controller = require("./controllers/catalogue1Controller.js");
var router     = require("./routing/catalogueRouter.js");

var catalogueController = controller(data);
var catalogueRouter = router(catalogueController);

server.start(config,catalogueRouter);