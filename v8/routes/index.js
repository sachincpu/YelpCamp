var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/",function(req,res){
   res.render("landing"); 
});



//=================
//AUTH ROUTES
//=================

//SHOW REGISTER FORM
router.get("/register",function(req,res){
   res.render("users/register");
});

//HANDLE SIGN UP
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       } 
        passport.authenticate("local")(req,res,function(){
           res.redirect("/campgrounds"); 
        });
    });
});

//SHOW LOGIN FORM
router.get("/login",function(req,res){
   res.render("users/login"); 
});

//HANDLE lOGIN
router.post("/login",passport.authenticate("local",
    {
    failureRedirect:"/login",
    successRedirect:"/campgrounds"
    }),function(req,res){
    
});

//LOGOUT LOGIC
router.get("/logout",function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});

//MIDDLEWARE TO CHECK IF USER IS LOGGED IN OR NOT
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }  
    res.redirect("/login");
};

module.exports = router;