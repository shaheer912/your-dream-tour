import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.js';

const secret = 'test';

const signToken = (user) =>
  jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: '1h',
  });

const clearAllUsers = async () => await UserModel.deleteMany();

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await UserModel.findOne({ email });

    if (!oldUser) {
      return res.status(404).json({ message: 'User does NOT exists' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: 'Invalid credentials!' });
    }

    const token = signToken(oldUser);
    return res.status(201).json({ result: oldUser, token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    // CLEAR ALL USERs
    //clearAllUsers();
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = signToken(result);

    return res.status(201).json({ result: result, token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const googleSignIn = async (req, res) => {
  const { email, name, token, googleId } = req.body;
  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      const result = { _id: oldUser._id, name, email };
      return res.status(201).json({ result: result, token: token });
    }
    const result = await UserModel.create({
      email,
      name: name,
      googleId,
    });

    return res.status(201).json({ result: result, token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
