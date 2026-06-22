const Joi = require("joi");

const RoomSchema = Joi.object({
  Room: Joi.object({
    title: Joi.string().required(),
    image: Joi.array().allow("", null),
    city: Joi.string().required(),
    area: Joi.string().required(),
    category: Joi.string().required(),
    roomType: Joi.string().required(),
    price: Joi.number().required().min(0),
    gender: Joi.string().required(),
    facilities: Joi.array().items(Joi.string()).required()
  }).required()
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});

//  booking schema:
const bookingschema=Joi.object({
  BookingRoom:Joi.object({
   username:Joi.string().required(),
   fatherName:Joi.string().required(),
   gender:Joi.string().required(),
   contact:Joi.string().required(),
   guardianNumber:Joi.string().required(),
    checkin:Joi.date().required(),
     leftdate:Joi.date().required(),
   useridcard: Joi.array().allow("", null),
     guardiancard: Joi.array().allow("", null),
   address:Joi.string().required(),
     booking: Joi.array().allow("", null),
  }).required()

});

module.exports = { RoomSchema, reviewSchema ,bookingschema};

