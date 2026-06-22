const mongoose = require("mongoose");
const Schema = mongoose.Schema
 const BookingSchema= new Schema({
    username:{
        type:String,
        required:true
    },
    fatherName:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    guardianNumber:
    {
        type:Number,
        required:true
    },
    checkin:{
        type:Date,
        required:true
    },
    leftdate:{
        type:Date,
        required:true
    },
    useridcard:[{
        url:String,
        filename:String,
    
    }],
    guardiancard:[{
        url:String,
        filename:String
    }],
    address:{
        type:String,
        required:true
    },
    room:{
        type:Schema.Types.ObjectId,
        ref:"room"
    },
    booking:[{
        url:String,
        filename:String
    }],
    

 })

 const  BookingRoom = mongoose.model("BookingRoom", BookingSchema);
 module.exports = BookingRoom;
 