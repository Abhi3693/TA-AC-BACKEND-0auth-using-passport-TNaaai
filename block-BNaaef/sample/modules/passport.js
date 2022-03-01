let passport = require("passport");
let GithubStrategy = require("passport-github").Strategy;
let User = require("../models/User");

passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
  scope: ['user:email'],
  },

  function (accessToken, refreshToken, profile, done) {
    let userInfo = {
      username:profile.username,
      photo:profile._json.avatar_url,
      email:profile._json.email,
    }

    User.findOne({email:profile._json.email}, (err, user)=>{
      if(err) return done(err);
      if(!user) {
        User.create(userInfo, (err, newUser)=>{
          if(err) return done(err);
          return done(null, newUser);
        });
      } else {
        return done(null, user);
      }
    });
  },
));


passport.serializeUser((user,done)=> {
  done(null, user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id, (err, user)=>{
    done(err, user);
  });
}); 