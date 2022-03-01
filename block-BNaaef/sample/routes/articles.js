var express = require('express');
const session = require('express-session');
var router = express.Router();
let Article = require("../models/Article");
let User = require("../models/User");

router.get("/", (req,res,next)=>{
  Article.find({}, (err, articles)=>{
    if(err) return next(err);

    res.render("articles", {articles})
  })
})

router.get("/new", (req,res,next)=>{
  let errMsg = req.flash("error");
  res.render("addArticle", {errMsg});
});


router.post("/", (req,res,next)=>{
  let userId = req.session && req.session.passport.user;
  if(userId) {
    req.body.author = userId;

    Article.create(req.body, (err, article)=>{
      if(err) return next(err);

      User.findByIdAndUpdate(userId, { $push: {articles:article._id}}, {new:true}, (err, user)=>{})

      res.redirect("/articles/" + article._id);
    });
  }
});

router.get("/:id/edit", (req,res,next)=>{
   let id = req.params.id;
   Article.findById(id, (err, article)=>{
     if(String(req.session.passport.user) === String(article.author)) {
       res.render("updateArticle", {article});
     } else {
       req.flash("error", "Only author can edit article");
       res.redirect("/articles/" + article._id);
     }
   });
});

router.get("/:id/delete", (req,res,next)=>{
  let id = req.params.id;
  Article.findById(id, (err, article)=>{
    if(err) return next(err);
    if(String(req.session.passport.user) === String(article.author)) {
      Article.findByIdAndDelete(id, (err, article)=>{
        if(err) return next(err);
        User.findByIdAndUpdate(article.author, { $pull: {articles:article._id}}, (err, user)=>{
          if(err) return next(err);
          res.redirect("/articles");
        });
      });
    } else {
      req.flash("error", "Only author can Delete article");
      res.redirect("/articles/" + article._id);
    }
  });
});

router.get("/:id", (req,res,next)=>{
  let id = req.params.id;
  let error = req.flash("error")
  Article.findById(id).populate("author").exec((err, article)=>{
    res.render("articleDetails", {article, error});
  });
});

router.post("/:id/edit", (req,res,next)=>{
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, {new:true}, (err, article)=>{
    if(err) return next(err);
    res.redirect("/articles/" + article._id);
  });
});

module.exports = router