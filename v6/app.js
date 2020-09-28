var express             =        require("express"),
    bodyParser          =        require("body-parser"),
    mongoose            =        require("mongoose"),
    Campground          =        require("./models/campground"),
    Comment             =        require("./models/comment"),
    passport            =        require("passport"),
    LocalStrategy       =        require("passport-local"), 
    User                =        require("./models/user"),
    seedDB              =        require("./seed"),
    app                 =        express();

//SEEDING THE DAtAbASE
seedDB();

//MONGOOSE CONGIG
mongoose.connect("mongodb+srv://test:test123@cluster0.9mkwc.mongodb.net/yelp_camp?retryWrites=true&w=majority",{useNewUrlParser:true  , useUnifiedTopology:true});

//APP CONFIG
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Something secret",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/",function(req,res){
   res.render("landing"); 
});



//=================
//CAMPGROUND ROUTES
//=================

//INDEX route
app.get("/campgrounds",function(req,res){
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
app.post("/campgrounds",function(req,res){
  var name= req.body.name;
  var image=req.body.image;
  var description=req.body.description;
  var newCampground={name:name,image:image,description:description};
    //Save to db
  Campground.create(newCampground,function(err,newlyCreated){
     if(err){
         console.log(err);
     } 
      res.redirect("/campgrounds");
  });
});

//NEW route
app.get("/campgrounds/new",function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW route
app.get("/campgrounds/:id",function(req,res){
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

//=================
//COMMENT ROUTES
//=================

//NEW ROUTE FOR COMMENT
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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
app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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



//=================
//AUTH ROUTES
//=================

//SHOW REGISTER FORM
app.get("/register",function(req,res){
   res.render("users/register");
});

//HANDLE SIGN UP
app.post("/register",function(req,res){
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
app.get("/login",function(req,res){
   res.render("users/login"); 
});

//HANDLE lOGIN
app.post("/login",passport.authenticate("local",
    {
    failureRedirect:"/login",
    successRedirect:"/campgrounds"
    }),function(req,res){
    
});

//LOGOUT LOGIC
app.get("/logout",function(req,res){
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

//STARTING THE SERVER
app.listen(3000,function(){
    console.log("Server Started");
});
