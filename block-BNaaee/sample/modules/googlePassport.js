let passport = require("passport");
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
let User = require("../models/User");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    let userInfo = {
      username:profile.displayName,
      photo:profile.photos[0].value,
      email:profile.email,
    }


    User.findOne({username:profile.displayName}, (err, user)=>{
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
  }
));


passport.serializeUser((user,done)=> {
  done(null, user.id);
});


passport.deserializeUser((id,done)=>{
  User.findById(id, (err, user)=>{
    done(err, user);
  });
}); 

