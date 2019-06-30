// dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require models
var db = require("./models");

// setting port
var PORT = process.env.PORT || 4717;

var app = express();

// initializing express router
var router = express.Router();

// logging requests with morgan logger
app.use(logger("dev"));

// parsing body into json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// making public static folder
app.use(express.static(__dirname + "/public"));

// connects to hbs
app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');


// use deployed DB, otherwise use local DB
var MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines";

// connecting to mongoose 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true});

app.use(router);

// starting server
app.listen(PORT, () => console.log("Listening on port: %s Visit http://localhost:%s/", PORT, PORT))
