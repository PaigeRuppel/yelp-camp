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
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

module.exports = router;



