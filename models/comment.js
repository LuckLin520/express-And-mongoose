var mongoose = require("mongoose");
var commentSchema = require("../schemas/comment");
var Comment = mongoose.model("comments", commentSchema);
module.exports = Comment;