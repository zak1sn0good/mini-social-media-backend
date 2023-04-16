const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLogininput } = require('../../utils/validators');

dotenv.config();

module.exports = {
  Mutation : {
    register : async(
      parent, 
      { registerInput : { username, email, password, confirmPassword } }, 
      context, 
      info
    ) => {
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if(!valid){
        throw new UserInputError('invalid inputs!', {
          errors : errors
        })
      }
      const user = await User.findOne({ username : username });
      if(user){
        throw new UserInputError('username already in use!', {
          errors : {
            username : 'this username is already taken!'
          }
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const new_user = new User({
        email : email,
        username : username,
        password : hashedPassword,
        createdAt : new Date().toISOString() 
      });
      const result = await new_user.save();
      const token  = jwt.sign({
        id : result.id,
        email : result.email,
        username : result.username
      }, process.env.SECRET_KEY,
      {
        expiresIn : '1h'
      });

      return {
        ...result._doc,
        id : result._id,
        token : token
      }
       
    },
    
    login : async(
      parent, 
      {username, password}, 
      context, 
      info
    ) => {
      const { valid, errors } = validateLogininput(username, password);
      if(!valid){
        throw new UserInputError('invalid inputs!', {
          errors : errors
        });
      }
      const user = await User.findOne({ username : username });
      if(!user){
        throw new UserInputError('wrong credentials!', {
          errors : {
            general : 'invalid username/password combination!'
          }
        });
      }
      const correctPassword = await bcrypt.compare(password, user.password);
      if(!correctPassword){
        throw new UserInputError('wrong credentials!', {
          errors : {
            general : 'invalid username/password combination!'
          }
        });
      }
      const token  = jwt.sign({
        id : user.id,
        email : user.email,
        username : user.username
      }, process.env.SECRET_KEY,
      {
        expiresIn : '1h'
      });

      return {
        ...user._doc,
        id : user._id,
        token
      };
    }
  }
}