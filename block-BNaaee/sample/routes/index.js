const { Router } = require('express');
var express = require('express');
var router = express.Router();
let passport = require("passport");
require("../modules/googlePassport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/success", (req,res,next)=>{
  let user = req.session;
  console.log(user);
  res.render("success");
});

router.get("/failure", (req,res,next)=>{
  res.send("<h1>failure</h1>");
});

router.get("/auth/github", passport.authenticate("github"));

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

 
router.get("/logout", (req,res)=>{
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;
