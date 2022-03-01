let User = require("../models/User");

module.exports = {
  isLoggedUser : (req,res,next)=>{
    if(req.session.passport) {
      if (req.session && req.session.passport.user) {
        next();
      } 
    } else {
      req.flash("error", "Needs login first");
      res.redirect("/");
    }
  },

  userInfo: (req,res,next)=>{
    if(req.session.passport) {
      var userId = req.session && req.session.passport.user;

      if (userId) {
        User.findById(userId, ["username", "email"], (err, user)=>{
          if(err) return next(err);
          req.user = user;
          res.locals.user = user;
          next();
        });
      } 
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  }
}