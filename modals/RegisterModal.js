let mongoose=require('mongoose');


let RegisterSchema=mongoose.Schema({
    Name:{type:String,required:true},
    Email:{type:String, unique:true,required:true},
    Phone:{type:String,unique:true,required:true},
    Profession:{type:String,required:true},
    UserProfile:{type:String},
    Password:{type:String,required:true}
})


let UserModal=mongoose.model('Users',RegisterSchema);

module.exports=UserModal