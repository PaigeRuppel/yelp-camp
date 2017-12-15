var LocalStrategy = require("passport-local"),
		Campground 		= require("./models/campground");
		Comment    		= require("./models/comment");
		User					= require("./models/user"),
		seedDB		 		= require("./seeds"),
		express    		= require("express"),
		app        		= express(),
		bodyParser 		= require("body-parser"),
		mongoose   		= require("mongoose"),
		passport 	 		= require("passport"),


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true});
app.set("view engine", "ejs");
seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//===================================================
//PASSPORT CONFIG
//===================================================

app.use(require("express-session")({
	secret: "Fern is a crazy raccoon cat",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============================================================
//MIDDLEWARE
//==============================================================
//makes user accessible for whole application
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

//way to authenticate logged in status
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} 
	res.redirect("/login");
}

//==============================================================

//===================================================
//RESTFUL ROUTES
//===================================================


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
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
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
	res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {

			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//=================================================================
// COMMENTS ROUTES
//=================================================================

//form hidden from user not logged in
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//post route hidden from user not logged in
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			var comment = req.body.comment;
			Comment.create(comment, function(err, comment){
				if(err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//=================================================================
//AUTHENTICATION ROUTES
//=================================================================

//Show register form
app.get("/register", function(req, res) {
	res.render("register");
});

//Handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			console.log(err);
			return res.render("/register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//Show login form
app.get("/login", function(req, res){
	res.render("login");
});

//Handle login logic
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
});

//Logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});




//==============================================================

app.listen(4000, function() {
	(console.log("The YelpCamp Server has started on port 4000"));
});