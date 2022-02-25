var express = require('express');
let User = require("../models/User");
let passport = require("passport");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/success", (req,res,next)=>{
  console.log(req.session,"=====")
  res.render("success");
});

router.get("/failure", (req,res,next)=>{
  res.send("<h1>Authentoication failed</h1>");
});

router.get("/auth/github", passport.authenticate("github"));

router.get("/auth/github/callback", 
passport.authenticate("github", {failureRedirect:"/failure"}), (req,res)=>{
  res.redirect("/success");
});

router.get("/logout", (req,res,next)=>{
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

module.exports = router;