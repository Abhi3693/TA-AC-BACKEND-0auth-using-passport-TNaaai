var express = require('express');
var router = express.Router();
let passport = require("passport");
let auth = require("../middlewares/auth")

require("../modules/passport");
require("../modules/googlePassport");

/* GET home page. */
router.get('/', function(req, res, next) {
  let errMsg = req.flash("error")
  res.render('index', { title: 'Express', errMsg });
});

router.get("/success", auth.isLoggedUser, (req,res,next)=>{
  let user = req.session;
  res.render("success");
});

router.get("/failure", auth.isLoggedUser, (req,res,next)=>{
  res.send("<h1>failure</h1>");
});

router.get('/auth/github',
  passport.authenticate('github'));

router.get("/auth/github/callback",
  passport.authenticate("github", {failureRedirect:"/failure" }),(req,res)=>{
    return res.redirect("/success");
  }
);

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failure' }),
  function(req, res) {
    return res.redirect("/success");
  });


router.get("/logout", auth.isLoggedUser, (req,res)=>{
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;
