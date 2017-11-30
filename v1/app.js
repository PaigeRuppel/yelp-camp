var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
	{name: "Salmon Creek", image: "https://farm5.staticflickr.com/4420/37403014592_c5f5d37906.jpg"},
	{name: "Salt Fork", image:"https://farm5.staticflickr.com/4123/4943676109_b93d9c1203.jpg"},
	{name: "Cantwell Cliffs", image: "https://farm4.staticflickr.com/3189/3062178880_4edc3b60d5.jpg"},
	{name: "Salmon Creek", image: "https://farm5.staticflickr.com/4420/37403014592_c5f5d37906.jpg"},
	{name: "Salt Fork", image:"https://farm5.staticflickr.com/4123/4943676109_b93d9c1203.jpg"},
	{name: "Cantwell Cliffs", image: "https://farm4.staticflickr.com/3189/3062178880_4edc3b60d5.jpg"},
	{name: "Salmon Creek", image: "https://farm5.staticflickr.com/4420/37403014592_c5f5d37906.jpg"},
	{name: "Salt Fork", image:"https://farm5.staticflickr.com/4123/4943676109_b93d9c1203.jpg"},
	{name: "Cantwell Cliffs", image: "https://farm4.staticflickr.com/3189/3062178880_4edc3b60d5.jpg"}

]
app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	// redirect back to campgrounds page
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});


app.listen(4000, function() {
	(console.log("The YelpCamp Server has started on port 4000"));
});