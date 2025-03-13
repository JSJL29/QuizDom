const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Registration successful!', userId: newUser.id, token });
  } catch (error) {
    console.error('Error while registering:', error);
    res.status(500).json({ message: 'Error while registering. Please try again.' });
  }
};

exports.checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "No users found with this email." });
        }
        res.status(200).json({ message: "User found. You can reset your password." });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: "Error verifying email." });
    }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ message: 'No users found with this email.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error resetting password.' });
  }
};