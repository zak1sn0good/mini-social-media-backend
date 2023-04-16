const { UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/checkAuth');
const { validateLikePost } = require('../../utils/validators');

module.exports = {
  Mutation : {
    likePost : async(parent, { postId }, context, info) => {
      const user = checkAuth(context);
      const { valid, errors } = validateLikePost(postId);
      if(!valid){
        throw new UserInputError('invalid input', {
          errors : errors
        });
      }
      const post = await Post.findById(postId);
      if(post){
        const likeIndex = post.likes.findIndex(like => like.username === user.username);
        if(likeIndex === -1){
          post.likes.unshift({ username : user.username, createdAt : new Date().toISOString() });
        }else{
          post.likes.splice(likeIndex, 1);
        }
        await post.save();
        return post;
      }else{
        throw UserInputError('post not found!');
      }
    }
  }
}