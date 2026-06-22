const Room = require("../data/room.js");
const BookingRoom = require("../data/Booking.js");
const { cloudinary } = require("../cloudconflict.js"); // ✔ Cloudinary top par import ho gaya

// 1. ALL ROOMS LISTING
module.exports.index = (async (req, res) => {
  const allrooms = await Room.find({});
  res.render("Rooms/index.ejs", { allrooms });
});

// 2. SHOW SPECIFIC ROOM
module.exports.show = (async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!room) {
    req.flash("error", "Room Not Found");
    return res.redirect("/Rooms");
  }
  res.render("Rooms/show.ejs", { room });
});

// 3. CREATE ROOM
module.exports.create = (async (req, res) => {
  const newRoom = new Room(req.body.Room);
  newRoom.owner = req.user._id;

  if (typeof req.files !== "undefined" && req.files.length > 0) {
    newRoom.image = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
  }

  await newRoom.save();
  req.flash("success", "new Room Added for rent");
  res.redirect("/Rooms");
});

// 4. EDIT ROOM FORM
module.exports.edit = async (req, res) => {
  let room = await Room.findById(req.params.id);
  if (!room) {
    req.flash("error", "Room Not Found");
    return res.redirect("/Rooms");
  }
  let originalimage = room.image[0]?.url;
  res.render("Rooms/edit.ejs", { room ,originalimage});
};

// 5. UPDATE ROOM (FIXED MISTAKE HERE)
module.exports.update = (async (req, res) => {
  let { id } = req.params;
  let room = await Room.findByIdAndUpdate(id, { ...req.body.Room });
  
  // Agar nayi images upload hui hain (req.files array check)
  if (typeof req.files !== "undefined" && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));
    // Purani images ke sath nayi images joor rahe hain (Push pattern)
    room.image.push(...newImages); 
    await room.save();
  }

  req.flash("success", "Information about Room Updated");
  res.redirect(`/Rooms/${id}`);
});

// 7. DELETE ROOM
module.exports.delete = (async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  req.flash("success", "Room Deleted");
  res.redirect("/Rooms");
});

// 8. SHOW BOOKING FORM
module.exports.booking = async (req, res) => {
  let room = await Room.findById(req.params.id);
  if (!room) {
    req.flash("error", "Room Not Found");
    return res.redirect("/Rooms");
  }
  res.render("Rooms/booking.ejs", { room });
};

// 9. SUBMIT BOOKING DATA
module.exports.bookingdata = async (req, res, next) => {
  try {
    let { id } = req.params;
    const bookingData = req.body.BookingRoom; 
    const userCardFiles = req.files['BookingRoom[useridcard]'] || [];
    const GuardianCardFiles = req.files['BookingRoom[guardiancard]'] || [];
    const Payment = req.files['BookingRoom[booking]'] || [];
    
    const useridcard = userCardFiles.map(file => ({
      url: file.path,
      filename: file.filename
    }));

    const guardiancard = GuardianCardFiles.map(file => ({
      url: file.path,
      filename: file.filename
    }));

    const booking = Payment.map(file => ({
      url: file.path,
      filename: file.filename
    }));

    const newbooking = new BookingRoom({
      ...bookingData,
      room: id,
      useridcard,
      guardiancard,
      booking
    });
    await newbooking.save();
    req.flash("success", "Room Booked Successfully!");
    res.redirect(`/Rooms/${id}`); 
  } catch (err) {
    next(err); 
  }
};