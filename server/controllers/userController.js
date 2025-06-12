const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role , name:user.name},   // <-- include role here
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

exports.registerUser = async (req, res) => {
  console.log("in register apiii");
  
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const users = await User.find({role:"user"}, '_id name email');
  res.json(users);
};

exports.getUserWithId = async (req, res) => {
  console.log("in req", req.user, req.params.id);
  
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const users = await User.findById(req.params.id).select('-password');
  res.json(users);
};

