var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//=================
//COMMENT ROUTES
//=================

//NEW ROUTE FOR COMMENT
router.get("/new",isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log("ERROR!");
        }
        else{
               res.render("comments/new",{campground:campground}); 
        }
    });
});

//CREATE ROUTE FOR COMMENT
router.post("/",isLoggedIn,function(req,res){
      //look for campground using id
    Campground.findById(req.params.id,function(err,campground){
    //create a new comment
      Comment.create(req.body.comment,function(err,comment){
          if(err){
              console.log("ERROR!");
          }
          else{
              //connect new comment to campground
              campground.comments.push(comment);
              campground.save();
             //redirect to campground show page 
            res.redirect("/campgrounds/" + campground._id);
          }
      });
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

