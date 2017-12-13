var express    = require("express"),
		app        = express(),
		bodyParser = require("body-parser"),
		mongoose   = require("mongoose"),
		Campground = require("./models/camground");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {campgrounds:allCampgrounds});
		}
	});
});

//CREATE - save new campground
app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description};
	// create new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
//find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
//render show template with that campground
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(4000, function() {
	(console.log("The YelpCamp Server has started on port 4000"));
});