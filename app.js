var express       =require("express");
var app           =express();
var mongoose      =require("mongoose"),
    methodOverride=require('method-override'),
    landingRoute = require('./routes/landing'),
    TravelhomeRoute=require('./routes/travel/home'),
    TravelindexRoute = require('./routes/travel/index'),
    bodyParser    =require('body-parser');


// var passport      = require("passport"),
//     LocalStrategy = require("passport-local").Strategy;

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
app.use(TravelindexRoute);
app.use(landingRoute);
app.use(TravelhomeRoute);
console.log(__dirname + "/public")

//init gfs



app.set("view engine", "ejs");

    app.use(express.static(__dirname + "/public"));
        app.get("/", function (req, res) {
        res.render("landing");
 })

    app.get("/study",function(req,res){
        res.render("study/index")
   })
   
   app.get("/login",(req,res)=>{
       res.render("login")
   })
    //mongoose.connect("mongodb://localhost/");
    app.listen(3000,function(){
        console.log("Aheru success")
    });