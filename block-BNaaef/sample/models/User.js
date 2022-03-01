let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let userSchema = new Schema({
  username:{type:String, required:true, unique:true},
  photo:String,
  email:String,
  articles:[{type:Schema.Types.ObjectId, ref:"Article"}]
});

let User = mongoose.model("User", userSchema);

module.exports = User;