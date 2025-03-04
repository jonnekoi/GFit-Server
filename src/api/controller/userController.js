import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  postRegisterUser,
  isUsernameAvailable, getUserByUsername
} from '../model/userModel.js';


const registerUser = async (req, res) => {
  try {
    const checkUsername = await isUsernameAvailable(req.body.username);
    if (!checkUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    req.body.role = 'user';
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




export {registerUser, loginUser};
