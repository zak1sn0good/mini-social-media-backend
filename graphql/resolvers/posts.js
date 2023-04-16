const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const { checkAuth } = require('../../utils/checkAuth');
const { validateCreatepost }  = require('../../utils/validators');

module.exports = {
  Query : {
    getPosts : async () => {
      try{
        const posts = await Post.find().sort({ createdAt : -1 });
        return posts;
      }catch(err){
        throw new Error(err);
      }
    },
    getPost : async (parent, { postId }, context, info) => {
      try{
        const post = await Post.findById(postId);
        if(post){
          return post;
        }else{
          throw new Error('post not found!');
        }
      }catch(err){
        throw new Error(err); 
      }
    }
  }, 
  Mutation : {
    createPost : async (parent, { body }, context, info) => {
      const user = checkAuth(context);
      const { valid, errors } = validateCreatepost(body);
      if(!valid){
        throw new UserInputError('invalid input!', {
          errors : errors
        });
      }
      const new_post = new Post({
        body : body,
        user : user.id,
        username : user.username,
        createdAt : new Date().toISOString(),
        comments : [],
        likes : []
      });
      const result = await new_post.save();
      return result;
    },
    deletePost : async(parent, { postId }, context, info) => {
      const user = checkAuth(context);
      try{
        const post  = await Post.findById(postId);
        if(post && post.user.toString() === user.id){
          await post.delete();
          return 'post deleted successfully!'
        }else{
          throw new AuthenticationError('action not allowed!');
        }
      }catch(err){
        throw new Error(err);
      }
    }
  }
}