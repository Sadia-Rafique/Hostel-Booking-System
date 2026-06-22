const express = require("express");
const router = express.Router();
const User = require("../data/User.js");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware.js")
const Usercontroler=require("../controllers/Usercontroler.js");
// async wrapper
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

router.route("/signup")
.get(Usercontroler.render)
.post( wrapAsync(Usercontroler.signup));

//  login get Route:
router.get("/login",Usercontroler.loginrender);
//  post req:
router.post("/login",saveRedirectUrl,passport.authenticate("local",{
  failureFlash:true,
  failureRedirect:"/login"
}),
 (Usercontroler.login)
);
//  for logout:
router.get("/logout",Usercontroler.logout);
module.exports = router;
