const express = require("express");
const router = express.Router();
const Room = require("../data/room.js");
const Booking = require("../data/Booking.js"); // Fixed: Khali const hata diya
const { RoomSchema, bookingschema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

const { isLogedIn } = require("../middleware.js");
const RoomlisingController = require("../controllers/Roomlisting.js");
const multer = require('multer');
const { storage, booking } = require("../cloudconflict.js");
const upload = multer({ storage: booking });


// async wrapper
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

// validateschema
const validateSchema = (req, res, next) => {
  let result = RoomSchema.validate(req.body);
  if (result.error) {
    return next(new ExpressError(400, result.error.message));
  }
  next();
};

// validateBooking
const validateBooking = (req, res, next) => {
  let result = bookingschema.validate(req.body);
  if (result.error) {
    return next(new ExpressError(400, result.error.message));
  }
  next();
};

// 1. GET ROUTE: Booking Form show karne ke liye
router.get("/:id/booking", isLogedIn, wrapAsync(RoomlisingController.booking));

// 2. POST ROUTE: Booking submit karne ke liye
router.post("/:id/booking",
  isLogedIn,
  upload.fields([
    { name: 'Room[image]', maxCount: 6 },
    { name: 'BookingRoom[useridcard]', maxCount: 2 },
    { name: 'BookingRoom[guardiancard]', maxCount: 2 },
    { name: 'BookingRoom[booking]', maxCount: 1 }
  ]),
  validateBooking,
  wrapAsync(RoomlisingController.bookingdata) 
);

module.exports = router;