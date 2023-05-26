const { User } = require('../models/user');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { SECRET_KEY } = process.env;

const { HttpError } = require('../helpers');
const { response } = require('../app');

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            throw HttpError(409, "Email in use");
        }
        const hashPassword =await bcrypt.hash(password, 10);
        
        const newUser = await User.create({ ...req.body, password:hashPassword });
      res.status(201).json({
          email: newUser.email,
          subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }
        const payload = { id: user._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
        res.json({
            token,
            email: user.email,
            subscription: user.subscription,
        })
  } catch (error) {
    next(error);
  }
}

module.exports = {
    register,
    login,
}