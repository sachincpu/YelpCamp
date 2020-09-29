var mongoose=require("mongoose");
var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

//Modelling the layout into a object
module.exports = mongoose.model("Campground",campgroundSchema);