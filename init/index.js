

const mongoose = require("mongoose");
const Room = require("../data/room.js");
const intData = require("../data/data.js");

const MonGO_url = "mongodb://127.0.0.1:27017/RoomData";



main()
  .then(() => {
    return initDb();
  })
  .catch((err) => {
    console.log("Connection Error:", err);
  });
  // function to connect Db
  async function main() {
  await mongoose.connect(MonGO_url);
  console.log("Connected to DB successfully.");
}
//  Data ko initialize karne ka function
const initDb = async () => {
  await Room.deleteMany({});
  intData.data = intData.data.map((obj) => ({ ...obj, owner: "6a3210ff1ea8a6540e960b7d" }));
  await Room.insertMany(intData.data);
  console.log("Data was saved");

};
initDb()