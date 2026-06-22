const Review=require("../data/review.js");
const Room=require("../data/room.js");
//  post:
module.exports.create=async (req, res) => {
  const room = await Room.findById(req.params.id);
  const newreview = new Review(req.body.review);
   newreview.author = req.user._id;
  room.reviews.push(newreview);
  await newreview.save();
  await room.save();
   req.flash("success","new Reveiew Added about Room")

  res.redirect(`/Rooms/${room._id}`)
};
//  delete:
module.exports.delete=async (req, res) => {
    const { id, reviewId } = req.params;

    await Room.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", " Review Deleted");
    res.redirect(`/Rooms/${id}`);
  }