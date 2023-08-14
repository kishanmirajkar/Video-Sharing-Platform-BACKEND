let mongoose=require('mongoose');


let videoSchema=mongoose.Schema({
    title:{type:String,required:true},
    date:{type:String,required:true},
    duration:{type:String,required:true},
    views:{type:String,required:true},
    Description:{type:String,required:true},
    Video:{type:String,required:true},
    Thumbnail:{type:String,required:true},
    PublisherProfilePic:{type:String,required:true},
    PublisherName:{type:String,required:true},
    PubilsherId:{type:mongoose.Types.ObjectId,ref:"Users"},
    Category:{type:String,required:true},
    Visibility:{type:String,required:true}
})

videoSchema.index({ title: 'text'});

let VideoModal=mongoose.model("Videos",videoSchema)

module.exports=VideoModal