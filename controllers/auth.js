const { User } = require('../models/user');

const jimp = require('jimp');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { nanoid } = require('nanoid');

const gravatar = require('gravatar');

const fs = require('fs/promises');

const { SECRET_KEY, PROJECT_URL } = process.env;

const { HttpError,sendEmail } = require('../helpers');

const path = require('path');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            throw HttpError(409, "Email in use");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);
        const verificationToken = nanoid();
        
        const newUser = await User.create({ ...req.body, password:hashPassword,avatarURL,verificationToken });
        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        });
        const verifyEmail = {
            to: email,
            subject: " Verify email",
            html:`<a target="_blank" href="${PROJECT_URL}/users/verify/${verificationToken}">Click to verify email</a>`
        }
        await sendEmail(verifyEmail);
  } catch (error) {
    next(error);
  }
}

const verify = async (req, res, next)=>{
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
            throw HttpError(404, "User not found")
        }
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
        res.status(200).json({
            message:'Verification successful'
        })
    } catch (error) {
        next(error);
    }
}

const resendVerifyEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(404, "User not found");
        }
        if (user.verify) {
            throw HttpError(400, 'Verification has already been passed');
        }
        const verifyEmail = {
            to: email,
            subject: " Verify email",
            html:`<a target="_blank" href="${PROJECT_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`
        }
        await sendEmail(verifyEmail);
        res.json({message:'Verify email send'})
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
        if (!user.verify) {
            throw HttpError(401, 'User not verified');
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }
        const payload = { id: user._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
        await User.findByIdAndUpdate(user._id, { token });
        res.json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        })
  } catch (error) {
    next(error);
  }
}

const getCurrent = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
    res.json({
         email,
         subscription,
    });
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        const { _id } = req.user;
    await User.findByIdAndUpdate(_id, {token:''});
        res.status(204).json();
    } catch (error) {
        next(error);
    }
}

const updateAvatar = async (req, res, next) => {

    try {
        const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
        await fs.rename(tempUpload, resultUpload);
            await jimp.read(`${resultUpload}`)
            .then((image) => {
                return image
                    .resize(250,250)
                    .write(`${resultUpload}`)
            })
        .catch((err) => {
    console.error(err);
  });
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({
        avatarURL,
    })
    } catch (error) {
        next(error);
    };
    
}

module.exports = {
    register,
    verify,
    resendVerifyEmail,
    login,
    getCurrent,
    logout,
    updateAvatar,
}