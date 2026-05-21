const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password, mobile } = req.body;

        if (!username || !email || !password || !mobile) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({ username, email, password, mobile });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        let users = await User.find({
            $or: [{ email: identifier }, { mobile: identifier }]
        });

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let targetUser = null;
        for (const user of users) {
            if (await user.matchPassword(password)) {
                targetUser = user;
                break;
            }
        }

        if (!targetUser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: targetUser._id,
            username: targetUser.username,
            email: targetUser.email,
            mobile: targetUser.mobile,
            token: generateToken(targetUser._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { registerUser, loginUser };
