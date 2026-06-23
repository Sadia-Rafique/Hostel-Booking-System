const User=require("../data/User.js");
//  for signup render:
module.exports.render=(req,res)=>{
    res.render("user/signup.ejs")
};
//  for signup:
 module.exports.signup=(async (req, res) => {
   try {
     let { username, email, password ,role} = req.body;
     const newUser = new User({ username, email ,role});
     const registedUser = await User.register(newUser, password);
 
     // IMPORTANT: do NOT logout after login; that clears req.user
     req.login(registedUser, (err) => {
       if (err) {
         req.flash("error", err.message);
         return res.redirect("/signup");
       }
       req.flash("success", "Welcome to Choose Your Hostel");
       return res.redirect("/Rooms");
     });
   } catch (e) {
     req.flash("error", e.message);
     return res.redirect("/signup");
   }
 });
 
//   for login
module.exports.loginrender=(req,res)=>{
  res.render("user/login");
};
//  after successfull login:
module.exports.login=(req, res) => {
  const redirectUrl = res.locals.redirectUrl || "/Rooms"; 
    res.redirect(redirectUrl);
  }

// for logout:
module.exports.logout=(req,res,next)=>{
  req.logout((err)=>{
    if(err)
    {
       return next(err);
    }
    req.flash("success","User loged out");
    res.redirect("/Rooms")

  })}