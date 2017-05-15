var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_DB);

var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err) {
  console.log("DB Error :", err);
});


// ===
var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});

var Data = mongoose.model('data',dataSchema);

Data.findOne( {name:"myData"}, function(err, data){
  if(err) return console.log("Data Error:",err);
  if(!data){
    Data.create( {name:"myData",count:0}, function(err,data){
      if(err) return console.log("Data Err : ", err);
      console.log("counter init : ",data);
    });
  }
});

// ===


// var MongoClient = require('mongodb').MongoClient;


//MongoClient.connect(uri, function(err, db) {
//  db.close();
//});


app.set("view engine",'ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());

// var data={count:0};

app.get("/",function(req, res) {
  // res.send('Hello World..!<p> HaHa ..!');

  // data.count++;

  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Datta error: ",err);
    data.count++;
    data.save(function(err){
      if(err) return console.log("data save err: ", err);
      res.render('my_ejs',data);
    });
  });

  // res.render('my_ejs',data);
});

app.get("/reset",function(req, res) {
  // res.send('Hello World..!<p> HaHa ..!');
  data.count=0;
  res.render('my_ejs',data);
});

app.get("/set/count",function(req, res) {
  // res.send('Hello World..!<p> HaHa ..!');
  if (req.query.count) data.count=req.query.count;
  res.render('my_ejs',data);
});

app.get("/set/:num",function(req, res) {
  // res.send('Hello World..!<p> HaHa ..!');
  if (req.params.num) data.count=req.params.num;
  res.render('my_ejs',data);
});
console.log(__dirname);

app.listen(3001, function() {
  console.log('Server is ejs On....!');
});
