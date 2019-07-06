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

// logging requests with morgan logger
app.use(logger("dev"));

// parsing body into json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// making public static folder
app.use(express.static(__dirname + "/public"));

// connects to hbs
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// use deployed DB, otherwise use local DB
var MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines";

// connecting to mongoose 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true});

// routes

// renders home page
app.get("/", function(req, res) {
    res.render("home");
})

// renders saved articles
app.get("/saved", function(req, res) {
    res.render("saved");
});

// starting server
app.listen(PORT, () => console.log("Listening on port: %s Visit http://localhost:%s/", PORT, PORT))

// get route scraping thrasher magazine
app.get("/scrape", function(req, res) {
    // grab the body of html with axios
    axios.get("https://www.theonion.com/").then(function(response) {
        // load cheerior and save as $ for shorthand selector
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            var result = {};

                // Adds the text href, image, and authors of each link and saves and proporties of result object.
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            result.image = $(this)
            .children("a")
            .children("img")
            .attr("src");
        
            // Create a new Article using the 'result' object built from scraping
            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err);
            })
        });
        res.send("Scrape complete");
    })
});

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    })
})

// Route for grabbing specific Article by id and populate it with the corresponding note
app.get("/articles/:id", function(req, res) {
    // using id passed by the id parameter prepare a query that finds the matching one in our db.
    db.Article.findOne({ id: req.params.id })
    // populates all notes associated with the article. 
    .populate("note").then(function(dbArticle) {

        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    })
})