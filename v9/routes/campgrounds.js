var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//=================
//CAMPGROUND ROUTES
//=================

//INDEX route
router.get("/",function(req,res){
    Campground.find({},function(err,allCampGrounds){
       if(err){
           console.log(err);
       } 
        else{
            
            res.render("campgrounds/index",{campgrounds:allCampGrounds});
        }
    });
    
});

//CREATE route
router.post("/",isLoggedIn,function(req,res){
  var name= req.body.name;
  var image=req.body.image;
  var description=req.body.description;
  var author={
      id: req.user._id,
      username: req.user.username   
  }
  var newCampground={name:name,image:image,description:description,author:author};
    //Save to db
  Campground.create(newCampground,function(err,newlyCreated){
     if(err){
         console.log(err);
     } 
      res.redirect("/");
  });
});

//NEW route
router.get("/new",isLoggedIn,function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW route
router.get("/:id",function(req,res){
    //Find the campground withprovided IP
    //.populate(),exec() since the Campground contains reference of comments inside it 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
             res.render("campgrounds/show",{campground:foundCampground});
       }
    });
});

//MIDDLEWARE TO CHECK IF USER IS LOGGED IN OR NOT
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }  
    res.redirect("/login");
};

module.exports = router;