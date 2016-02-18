// import modules
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// connect database
mongoose.connect("mongodb://kongtech:kongtech892@ds011218.mongolab.com:11218/esp8266");
var db = mongoose.connection;
db.once("open",function () {
  console.log("DB connected!");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

// model setting
var postSchema = mongoose.Schema({
  data: {type:String, required:true},
});
var Post = mongoose.model('post',postSchema);

// view setting
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({exteded:true}));

// set routes
app.get('/posts', function(req,res){
  Post.find({}, function (err,posts) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/index",{data:posts});
  });
}); // index
app.post('/posts', function(req,res){
  Post.create(req.body.post,function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
}); // create
/*
app.get('/posts/:id', function(req,res){
  Post.findById(req.params.id, function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
}); // show
*/

app.put('/posts/:id', function(req,res){
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" updated"});
  });

}); //update
/*
app.delete('/posts/:id', function(req,res){
  Post.findByIdAndRemove(req.params.id, function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" deleted"});
  });
}); //destroy
*/
// start server
app.listen(80, function(){
  console.log('Server On!');
});
