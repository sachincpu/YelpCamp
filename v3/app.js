var express             =        require("express"),
    bodyParser          =        require("body-parser"),
    mongoose            =        require("mongoose"),
    Campground          =        require("./models/campground"),
    seedDB              =        require("./seed"),
    app                 =        express()

seedDB();

mongoose.connect("mongodb+srv://test:test123@cluster0.9mkwc.mongodb.net/yelp_camp?retryWrites=true&w=majority",{useNewUrlParser:true  , useUnifiedTopology:true});


app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

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
            
            res.render("index",{campgrounds:allCampGrounds});
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
   res.render("new"); 
});

//SHOW route
app.get("/campgrounds/:id",function(req,res){
    //Find the campground withprovided IP
    //.populate(),exec() since the Campground contains reference of comments inside it 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
           console.log(foundCampground);
             res.render("show",{campground:foundCampground});
       }
    });
});



app.listen(3000,function(){
    console.log("Server Started");
});
