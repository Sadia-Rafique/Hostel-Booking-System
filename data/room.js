const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review.js");
const roomSchema = new schema({
  title:{
    type:String,
    required:true,
  },
  city:{
    type:String,
    required:true,
  },
  area:{
    type:String,
    required:true,
},
roomType:{
  type:String,
  required:true,
},
category:{
  type:String,
  required:true,
},
price:{
  type:Number,
  required:true,
},
gender:{
  type:String,
  required:true,
},

 image:[
 {
    url: String,
    filename: String,
  }],
facilities:{
    type:[String],
  required:true,

},
reviews:[
  {
    type:schema.Types.ObjectId,
    ref:"Review"
  }
],
owner:
  {
    type:schema.Types.ObjectId,
    ref:"User"
  }

});

roomSchema.post("findOneAndDelete",async(room)=>{
  if(room){
  await Review.deleteMany({_id:{$in: room.reviews}});
  }
})
const Room = mongoose.model("Room", roomSchema);
module.exports = Room;


