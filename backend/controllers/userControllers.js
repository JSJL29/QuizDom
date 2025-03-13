const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        console.log("DEBUG: User recovered:", user ? user.toJSON() : "No users found");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username) {
            console.log("DEBUG: Update username:", username);
            user.username = username;
        }

        if (email) {
            console.log("DEBUG: Email update:", email);
            user.email = email;
        }

        if (newPassword) {
            console.log("DEBUG: Password change request");
            
            if (!currentPassword) {
                console.log("DEBUG: No current password provided");
                return res.status(400).json({ message: "Current password is required to change password" });
            }

            console.log("DEBUG: Checking current password...");
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            console.log("DEBUG: Result of bcrypt.compare:", isMatch);

            if (!isMatch) {
                console.log("DEBUG: Current password incorrect");
                return res.status(400).json({ message: "Current password incorrect" });
            }

            console.log("DEBUG: Hashing new password...");
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            console.log("DEBUG: New hashed password:", hashedPassword);
            user.password = hashedPassword;
        }

        console.log("DEBUG: Saving changes...");
        await user.save();
        console.log("DEBUG: Changes saved successfully");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('DEBUG: Error updating profile:', error.message);
        console.error(error.stack);
        res.status(500).json({ message: "Error updating profile" });
    }
};



exports.getUserData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: "Error retrieving user data" });
    }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'updatedAt'] } 
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};