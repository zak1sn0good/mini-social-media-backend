const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/checkAuth');
const { validateComment, validateDeleteComment } = require('../../utils/validators');
module.exports = {
  Mutation : {
    createComment : async(parent, { postId, body }, context, info) => {
      const user = checkAuth(context);
      const { valid, errors } = validateComment(postId, body);
      if(!valid){
        throw new UserInputError('invalid input!', {
          errors : errors
        });
      } 
      try{
        const post  = await Post.findById(postId);
        if(post){
          post.comments.unshift({
            body : body,
            username : user.username,
            createdAt : new Date().toISOString()
          });
          await post.save();
          return post;
        }else{
          throw new UserInputError('post not found');
        }
      }catch(err){
        throw new Error(err);
      }
    },
    deleteComment : async(parent, { postId, commentId }, context, info) => {
      const user = checkAuth(context);
      const { valid, errors } = validateDeleteComment(postId, commentId);
      if(!valid){
        throw new UserInputError('invalid input!', {
          errors : errors
        });
      }
      try{
        const post = await Post.findById(postId);
        if(post){
          const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
          if(commentIndex === -1){
            throw new UserInputError('comment not found!');
          }else{
            if(post.comments[commentIndex].username === user.username){
              post.comments.splice(commentIndex, 1);
              await post.save();
              return post; 
            }else{
              throw new AuthenticationError('action not allowed!');
            }
          }
        }else{
          throw new UserInputError('post not found');
        }
      }catch(err){
        throw new Error(err);
      }   
    }
  }
};