var mongoose = require("mongoose");
var userSchemas = require("../schemas/user");//加载schema
var User = mongoose.model("users", userSchemas);//第一个参数定义该集合名称，第二个schema
module.exports = User;