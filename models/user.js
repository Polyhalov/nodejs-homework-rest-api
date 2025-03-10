const Joi = require('joi');

const { Schema, model } = require('mongoose');

const { handleMongooseError } = require('../helpers');

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: ""
  },
  verify: {
    type: Boolean,
    default:false,
  },
  verificationToken:{
  type: String,
    required:[true, 'Verify token is required'],
  },
  avatarURL:{
    type: String,
    required: true,
  },
}, { versionKey: false });


userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string()
})
const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(), 
    subscription:Joi.string()
})

const emailSchema = Joi.object({
  email: Joi.string().required().messages({ 'any.required': 'missing required field email' }),
})
const schemas = {
    registerSchema,
  loginSchema,
    emailSchema,
}

const User = model('user', userSchema);

module.exports = {
    User, 
    schemas
}