var express             =        require("express"),
    bodyParser          =        require("body-parser"),
    mongoose            =        require("mongoose"),
    Campground          =        require("./models/campground"),
    Comment             =        require("./models/comment"),
    seedDB              =        require("./seed"),
    app                 =        express()

seedDB();

mongoose.connect("mongodb+srv://test:test123@cluster0.9mkwc.mongodb.net/yelp_camp?retryWrites=true&w=majority",{useNewUrlParser:true  , useUnifiedTopology:true});


app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
   res.render("landing"); 
});


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
app.get("/campgrounds/:id/comments/new",function(req,res){
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
app.post("/campgrounds/:id/comments",function(req,res){
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

app.listen(3000,function(){
    console.log("Server Started");
});
