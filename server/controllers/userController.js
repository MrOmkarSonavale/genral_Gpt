import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


//genrate token
const genrateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
};


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        };

        const user = await User.create({
            name, email, password
        });

        const token = genrateToken(user._id);

        res.json({ success: true, token });

    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            const isMatch = await bcrypt.compare(password, userExists.password);

            if (isMatch) {
                const token = genrateToken(userExists._id);

                return res.json({ success: true, token });
            }
        };

        return res.json({ success: false, message: 'Invalid credentials' });

    } catch (err) {
        return res.status(500).json({ message: err.message || 'Server error' });
    }
};


export const getUser = async (req, res) => {
    try {
        const user = req.user;

        return res.json({ success: true, user });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    };
};
