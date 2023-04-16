const validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {};
  const emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|fr|dz|info|mobi|name|aero|jobs|museum)\b/;
  if(username.trim() === '') errors.username = 'username must not be empty!';
  if(email.trim() === '') errors.email = 'username must not be empty!';
  if(password.trim() === '') errors.password = 'username must not be empty!';
  if(confirmPassword.trim() === '') errors.confirmPassword = 'username must not be empty!';
  if(!email.match(emailRegEx)) errors.email = 'email address is not valid!';
  if(password !== confirmPassword) errors.confirmPassword = 'passwords must be matched!';

  return {
    errors,
    valid : Object.keys(errors).length > 0 ? false : true
  }
};

const validateLogininput = (username, password) => {
  const errors = {};
  if(username.trim() === '') errors.username = 'username must not be empty!';
  if(password.trim() === '') errors.password = 'username must not be empty!';
  
  return {
    errors,
    valid : Object.keys(errors).length > 0 ? false : true
  }
};

const validateComment = (postId, commentBody) => {
  const errors = {};
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if(commentBody.trim(' ') === '') errors.commentBody = 'comment must not be empty!';
  if(!postId.match(objectIdRegex)) errors.postId = 'invalid post id!';
  return {
    errors,
    valid : Object.keys(errors).length > 0 ? false : true
  }
};

const validateDeleteComment = (postId, commentId) => {
  errors = {};
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if(!postId.match(objectIdRegex)) errors.postId = 'invalid post id!';
  if(!commentId.match(objectIdRegex)) errors.commentId = 'invalid post id!';
  return {
    errors,
    valid : Object.keys(errors).length > 0 ? false : true
  }
};

const validateLikePost = (postId) => {
  errors = {};
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if(!postId.match(objectIdRegex)) errors.postId = 'invalid post id!';
  return {
    errors,
    valid : Object.keys(errors).length > 0 ? false : true
  }
};

const validateCreatepost = (body) => {
  errors = {};
  if(body.trim() === '') errors.postBody = 'post body must not be empty!';
  return {
    errors,
    valid : Object.keys(errors).length > 0 ? false : true
  }
}

module.exports = {
  validateRegisterInput,
  validateLogininput,
  validateComment,
  validateDeleteComment,
  validateLikePost,
  validateCreatepost
}