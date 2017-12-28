var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var Middleware = require("../middleware");





//=================================================================
// ROUTES
//=================================================================

//ADD NEW COMMENT
router.get("/new", Middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//SAVE NEW COMMENT
router.post("/", Middleware.isLoggedIn, function(req, res) {
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
					req.flash("success", "Successfully added comment!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT COMMENT
router.get("/:comment_id/edit", Middleware.isCommentOwner, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE COMMENT
router.put("/:comment_id", Middleware.isCommentOwner, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY COMMENT
router.delete("/:comment_id", Middleware.isCommentOwner, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})


module.exports = router;



