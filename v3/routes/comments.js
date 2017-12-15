var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//================================================================

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} 
	res.redirect("/login");
}


//=================================================================
// ROUTES
//=================================================================

//ADD NEW COMMENT
//form hidden from user not logged in
router.get("/new", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//SAVE NEW COMMENT
//post route hidden from user not logged in
router.post("/", isLoggedIn, function(req, res) {
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

module.exports = router;