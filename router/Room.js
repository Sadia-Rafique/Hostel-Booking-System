const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const Room = require("../data/room.js");
const { RoomSchema,bookingschema } = require("../schema.js");
const { isLogedIn,isOwner} = require("../middleware.js");
const RoomlistingController=require("../controllers/Roomlisting.js");
const multer  = require('multer');
const { storage } = require("../cloudconflict.js");
const upload = multer({ storage });


// validation
const validateSchema = (req, res, next) => {
  let result = RoomSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.message);
  }
  next();
};

// async wrapper
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

// about
router.get("/about", (req, res) => {
  res.render("Rooms/about.ejs");
});

// contact
router.get("/contact", (req, res) => {
  res.render("Rooms/contact.ejs");
});

// NEW
router.get("/new", isLogedIn, (req, res) => {
  res.render("Rooms/new.ejs");
});
// index and create Route:
 router.route("/")
.get( wrapAsync(RoomlistingController.index))
.post(
  isLogedIn,
  upload.array("Room[image]",6),
  validateSchema,
  wrapAsync(RoomlistingController.create)
)
;

// EDIT
router.get("/:id/edit", isLogedIn,isOwner, wrapAsync(RoomlistingController.edit));
//  show ,update abd delete
router.route("/:id")
.get( wrapAsync(RoomlistingController.show))
.put(
  
  isLogedIn,
  isOwner,
  validateSchema,
    upload.array("Room[image]",6),
  wrapAsync(RoomlistingController.update)
)
.delete(
 
  isLogedIn,
  isOwner,
  wrapAsync(RoomlistingController.delete)
);
module.exports = router;

