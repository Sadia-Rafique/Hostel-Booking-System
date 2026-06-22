const mongoose = require("mongoose");
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose");
const passportLocalMongoosePlugin = passportLocalMongoose.default || passportLocalMongoose;


const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
 role: {
    type: String,
    enum: ["customer", "owner"],
}

});

UserSchema.plugin(passportLocalMongoosePlugin);

module.exports = mongoose.model("User", UserSchema);


