let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title:String,
  author:{type:Schema.Types.ObjectId, ref:"User"},
});

let Article = mongoose.model("Article", articleSchema);

module.exports = Article
