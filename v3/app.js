var LocalStrategy  = require("passport-local"),
		Campground 		 = require("./models/campground");
		Comment    		 = require("./models/comment");
		User					 = require("./models/user"),
		seedDB		 		 = require("./seeds"),
		express    		 = require("express"),
		app        		 = express(),
		bodyParser 		 = require("body-parser"),
		mongoose   		 = require("mongoose"),
		flash					 = require("connect-flash"),
		passport 	 		 = require("passport"),
		methodOverride = require("method-override");


var commentRoutes 	 = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes 		 = require("./routes/index");


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient:true});
app.set("view engine", "ejs");

// seedDB(); // Seed the Database

app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


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

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});


//==============================================================

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);








//==============================================================

app.listen(4000, function() {
	(console.log("The YelpCamp Server has started on port 4000"));
});