const Room=require("./data/room.js");
const Review=require("./data/review.js");
module.exports.isLogedIn=((req,res,next)=>{
    
  if(!req.isAuthenticated()){
     req.session.redirectUrl=req.originalUrl;
     req.flash("error","Your have no account");
      return res.redirect("/login");
  }

   next()
});

module.exports.saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl)
   {
      res.locals.redirectUrl=req.session.redirectUrl;
   
   }
   next();
}
//  owner Authorization:
module.exports.isOwner=(async(req,res,next)=>{
let {id}=req.params;
  let room=await Room.findById(id);
    const ownerId = room.owner._id ? room.owner._id.toString() : room.owner.toString();
    const currentUserId = res.locals.currentUser._id.toString();
       if (ownerId !== currentUserId) {
        req.flash("error", "You have no permission to do that");
        return res.redirect(`/Rooms/${id}`);
  }
  next();
})
//  Review Authorization:
module.exports.isReviewAuthor=(async(req,res,next)=>{
let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
    const authorid = review.author._id ? review.author._id.toString() : review.author.toString();
    const currentUserId = res.locals.currentUser._id.toString();
       if (authorid !== currentUserId) {
        req.flash("error", "You have no permission to do that");
        return res.redirect(`/Rooms/${id}`);
  }
  next();
})