var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
{
	name: "Owens Creek",
	image: "https://ridb.recreation.gov/images/80357.jpg",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
},
{
	name: "Cave Springs",
	image: "https://c1.staticflickr.com/5/4474/37931098211_58cc58006f_b.jpg",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
},
{
	name: "Bowman Lake",
	image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
}
]

function seedDB() {
	//Remove all campgrounds
		Campground.remove({}, function(err){
		if (err) {
			console.log(err);
		}
		console.log("removed campgrounds!");
			//Add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err) {
					console.log(err);
				} else {	
					console.log("added a campground");
					//create a comment
					Comment.create(
						{
							text: "What an amazing place to spend a weekend!",
							author: "Homer"
						}, function(err, comment) {
							if(err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("added a comment");
							}
						});
				}
			});
		});
	});	
}

module.exports = seedDB;