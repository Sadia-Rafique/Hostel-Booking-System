const dotenv=require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require("mongoose");
const Room=require("./data/room.js");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
app.engine("ejs",ejsmate);
const ExpressError=require("./utils/ExpressError.js");
const {RoomSchema,reviewSchema}=require("./schema.js");
const Review=require("./data/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./data/User.js");


//  for paths:
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

// Prefer correct env var for mongo uri
const dblink =  process.env.DB_URL;
//  call to DB:
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
await mongoose.connect(dblink);
}

const store = MongoStore.create({
    mongoUrl: dblink,
    crypto: {
        secret: process.env.SECRET_KEY,
    },
    touchAfter: 24 * 3600,
});
// session define
const sessionOption = {
    store:store,
      secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
//  for error:
store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})

// 1. Setup session first!
app.use(session(sessionOption));
app.use(flash());

// 2. Setup Passport completely
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
     res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.currentUser=req.user || null;
     next();
})

const roomRouter = require("./router/Room.js");
const reviewRouter = require("./router/Review.js");
const UserRouter = require("./router/User.js");
const bookingRoute =require("./router/bookingRoute.js");

app.use("/Rooms", roomRouter);
app.use("/Rooms", reviewRouter);
app.use("/", UserRouter);
app.use("/Rooms",bookingRoute)
// home Page
app.get("/", (req, res) => {
    res.redirect("/Rooms");
});


// Error handling middleware
app.use((req, res, next) => { 
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("Rooms/error.ejs", { message });
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});