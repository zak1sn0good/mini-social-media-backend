const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  body : String,
  username : String,
  likes : [
    {
      username: String,
      createdAt : String
    }
  ],
  createdAt : String,
  comments : [
    {
      username : String,
      body : String,
      createdAt : String
    }
  ],
  user : {
    type : Schema.Types.ObjectId,
    ref : 'users'
  }
});

module.exports = model('Post', postSchema);