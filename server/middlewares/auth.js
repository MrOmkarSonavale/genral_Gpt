import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const userId = decoded.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({ message: 'Not authorized' });
    }
};