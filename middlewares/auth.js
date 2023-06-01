import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const secret = 'test';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const isCustomToken = token.length < 500; // its not a Google token
    let decodedToken;
    if (token && isCustomToken) {
      decodedToken = jwt.verify(token, secret);
      req.userId = decodedToken?.id;
    } else {
      decodedToken = jwt.decode(token);
      const googleId = decodedToken?.sub?.toString();
      const user = await UserModel.findOne({ googleId });
      req.userId = user?._id;
    }
    next();
  } catch (error) {
    console.error(error);
  }
};

export default auth;
