//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


mongoose.connect("mongodb://localhost:27017/listDB");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

Item.countDocuments({}, (err, count)=>{
	if(err)
		console.log(err);
	else{
		if(count == 0){
			const item1 = new Item ({
				name: "Welcome to the toDoList!!"
				});
			
				const item2 = new Item({
				name: "Hit + to add an item to the list"
				});
			
				const item3 = new Item({
				name: "<-- Check this to remove item from the list"
				});
			
				Item.insertMany([item1, item2, item3], (err) => {
				if(err)
					console.log(err);
				else
					console.log("Successfully inserted");
				});
		}
	}

});

app.get("/", function(req, res) {

	const day = date.getDate();
	const collection = _.capitalize(req.params.listName);
	newListItems = [];
	Item.find({}, (err, listItems)=>{
		if(err)
			console.log(err);
		else{
			res.render("list", {listTitle: day, newListItems: listItems, url: collection});
		}
	});
	// console.log(newListItems);
});

app.post("/", function(req, res){
	const addItem = req.body.newItem;
	const item = new Item({
		name: addItem
	});
	item.save();
	res.redirect("/");
});

app.post("/delete", (req, res)=>{
	const id = req.body.checkbox;
	Item.deleteOne({_id: id}, (err) => {
		if(err)
			console.log(err);
		else
			console.log("Deletion successful");
	});

	res.redirect("/");
});
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });


app.get("/:listName", (req, res)=>{
	const day = date.getDate();

	const collection = req.params.listName;
	const Collection = mongoose.model(collection, itemSchema);

	Collection.find({}, (err, items)=>{
		if(err)
			console.log(err);
		else
			res.render("list", {listTitle: day, newListItems: items, url: collection});
	});
});


app.post("/:listName", (req, res)=>{
	const addItem = req.body.newItem;
	const collection = _.capitalize(req.params.listName);
	const Collection = mongoose.model(collection, itemSchema);
	const item = new Collection({
		name: addItem
	});
	item.save();
	res.redirect("/" + collection);
});


app.post("/delete/:listName", (req, res)=>{
	const id = req.body.checkbox;

	const collection = _.capitalize(req.params.listName);
	const Collection = mongoose.model(collection, itemSchema);

	Collection.deleteOne({_id: id}, (err) => {
		if(err)
			console.log(err);
		else
			console.log("Deletion successful");
	});

	res.redirect("/" + collection);
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
