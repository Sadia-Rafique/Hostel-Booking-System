const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const {RoomSchema,reviewSchema}=require("../schema.js");
const Review=require("../data/review.js");
const Room=require("../data/room.js");
const {isLogedIn,isReviewAuthor}=require("../middleware.js");
const ReviewController=require("../controllers/Reviewcontroler.js");


// For Review Schema Validation:
const  ReviewSchema=((req,res,next)=>{
  let result=reviewSchema.validate(req.body);
  if(result.error){
    throw new ExpressError(400,result.error.message);
  } else{
    next();
  }
});
// WrapAsync Function:
function wrapAsync(fn){
  return function(req,res,next){
    fn(req,res,next).catch(next);
  }
}
router.post("/:id/reviews",isLogedIn,ReviewSchema,wrapAsync(ReviewController.create));

// Delete Review:
router.delete(
  "/:id/reviews/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.delete)
  );
module.exports = router;