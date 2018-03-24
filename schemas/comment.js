var mongoose = require("mongoose");
var comSchema = mongoose.Schema({
	title: String,
	content: String,
	img: String,
	author: String
});
module.exports = comSchema;
