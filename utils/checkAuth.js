const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { AuthenticationError } = require('apollo-server')
dotenv.config();

const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if(authHeader && authHeader.startsWith('Bearer')){
    const token = authHeader.split(' ')[1];
    if(token){
      try{
        const user = jwt.verify(token, process.env.SECRET_KEY);
        return user;
      }catch(err){
        throw new AuthenticationError('invalid/expired token!');
      }
    }else{
      throw new Error('authentication token must be formatted like this : \'Bearer [token]\'!');
    }
  }else{
    throw new Error('authentication header must be present!');
  }
};

module.exports = {
  checkAuth
}