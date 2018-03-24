var mongoose = require("mongoose");
var userSchemas = mongoose.Schema({//声明这个集合并添加所用字段
	name: String,
	pwd: String
})
module.exports = userSchemas;