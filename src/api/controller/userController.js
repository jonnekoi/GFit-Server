import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  postRegisterUser,
  isUsernameAvailable, getUserByUsername, saveProfilePicturePath
} from '../model/userModel.js';
import path from 'path';
import fs from 'fs';

const registerUser = async (req, res) => {
  try {
    const checkUsername = await isUsernameAvailable(req.body.username);
    if (!checkUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    req.body.access = 'user';
    const result = await postRegisterUser(req.body);
    if (!result) {
      return res.status(400).json({ message: 'Failed to register user' });
    }
    try {
      const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
        expiresIn: '12h',
      });
      return res.status(200).json({ message: "New user added!", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const loginUser = async (req, res) => {
  const user = await getUserByUsername(req.body.username);
  if (!user) return res.status(401).json({ message: "Invalid username" });

  if (!bcrypt.compareSync(req.body.password, user.password))
    return res.status(401).json({ message: "Invalid password" });

  delete user.password;

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  res.status(200).json({ user: user, token });
};

const uploadProfilePicture = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const clientId = req.body.clientId;
    const fileExtension = path.extname(file.originalname);
    file.filename = `${clientId}-profile${fileExtension}`;
    const filePath = path.join('uploads', file.filename);

    await saveProfilePicturePath(clientId, filePath);

    res.status(200).json({ message: 'Profile picture uploaded successfully', filePath });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.log(error);
  }
}

const getProfilePicture = (req, res) => {
  const { filename } = req.params;
  let filePath = path.join('uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      filePath = path.join('uploads', 'defaultPicture.jpg');
    }
    res.sendFile(path.resolve(filePath));
  });
}





export {registerUser, loginUser, uploadProfilePicture, getProfilePicture};
