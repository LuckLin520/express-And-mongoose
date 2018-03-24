var express = require("express"); //加载express构造函数
var app = express(); //生成创建服务的实例
var bodyParser = require("body-parser");//获取post请求参数
var mongoose = require("mongoose");//链接mongoDB的库

app.use(express.static("statics"));//指定资源路径
app.use(express.static("uploadcache"));
//将当前全局对象下的Promise赋值给mongoose.promise
mongoose.Promise = global.Promise;
//链接mongodb数据库,第二个参数表示兼容老版本mongo
mongoose.connect("mongodb://localhost:27017/1710mongo", {useMongoClient: true}, function(err){
	if(!err){			//此处这个函数的第一个参数是mongoose库提供的一个内置的错误对象
		console.log("连接成功")
	}else{
		console.log("连接失败")
	}
});



app.use(bodyParser.json());//处理以json格式的提交
app.use(bodyParser.urlencoded({//处理以form表单的提交
	extended: true
}))

//路由
app.get("/", function(req, res){//这里res和req对象是由express封装过的了
	res.send(`<p>
				my first express！
			</p>`);
})

var User = require("./models/user");//导入model
//处理登录（查询）
app.post("/login", function(req, res){
	console.log(req.body)//请求的参数对象
	let {username, password: pwd} = req.body;
	//检测用户名和密码是否正确
	User.find({name: username}, function(err, doc){
		console.log(doc);
		if(err){return};
		if(!doc.length){
			res.json({
				code: 1,
				msg: "用户名错误！"
			})
		}else{
			if(pwd === doc[0].pwd){
				res.json({
					code: 0,
					msg: "登录成功！"
				})
			}else{
				res.json({
					code: 1,
					msg: "密码错误！"
				})
			}
		}
	})
})

//处理注册（增加）
app.post("/regist", function(req, res){
	console.log(req.body);
	let {name: username, pwd} = req.body;//解构赋值(username=name)
	//判断用户是否已存在，存在提示用户登录（调用model的find()方法）
	User.find({name: username}, function(err, doc){//doc查到的数据
		if(err){return};
		if(doc.length){
			res.json({
				code: 1,
				msg: "用户名已存在"
			})
		}else{
			//操作数据库，存储数据
			var user = new User({//实例化mongo数据库文档的model
				name: username,
				pwd
			});
			user.save(function(err, doc){//第一个参数为错误对象，第二个为当前存储的对象
				if(err){return};
				res.json({//没有错误就返回数据给前端
					code: 0,
					msg: "注册成功"
				})
			})
		}
	})
})

//获取所有评论列表：
var Comment = require("./models/Comment");
app.get("/fetchComment", function(req, res){
	var {title, content, img, author} = req.body;
	Comment.find({}, function(err, doc){
		if(err){return};
		res.json({
			code: 0,
			list: doc
		})
	})
})
//删除指定某条评论：
app.post("/deleteComment", function(req, res){
	Comment.findOneAndRemove({_id: req.body._id}, function(err, doc){
		if(err){return};
		res.json({
			code: 0,
			msg: "删除成功！"
		})
	})
})
//上传图片
var upload = require("./statics/js/upload");
app.post("/upload", function(req, res){
	//upload.upload()是在formidable的配置文件中用exports.upload定义的一个函数,这个函数中引用了formidable插件，同时也包含了返回给前端数据的过程（可以阅读这个formidable配置文件）
	upload.upload(req, res);
})
//评论提交
app.post("/sbtComment", function(req, res){
	var comment = new Comment(req.body);
	comment.save(function(err, doc){//这个doc就是存储的对象
		if(err){return};
		res.json({
			code: 0,
			list: [doc]
		})
	})
})
//评论修改
app.post("/modifyComment", function(req, res){
	let {_id, title, content, img} = req.body;
					//参数3：new取布尔值，true表示返回修改的这个对象
	Comment.findOneAndUpdate({_id}, {title, content, img}, {new: true}, function(err, doc){
		if(err){return};
		res.json({
			code: 0,
			list: [doc]
		})
	})
})
app.listen(8848, ()=>{
	console.log("启动成功");
})