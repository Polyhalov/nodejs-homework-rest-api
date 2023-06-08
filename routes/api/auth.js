const express = require('express');

const { validateBody } = require('../../decorators/validateBody');

const { authenticate } = require('../../decorators');

const { upload } = require('../../decorators/upload');

const usersController = require('../../controllers/auth');

const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), usersController.register);

router.get('/verify/:verificationToken', usersController.verify);

router.post('/verify',validateBody(schemas.emailSchema), usersController.resendVerifyEmail)

router.post('/login', validateBody(schemas.loginSchema), usersController.login);

router.get('/current', authenticate, usersController.getCurrent);

router.post('/logout', authenticate, usersController.logout);

router.patch('/avatars',authenticate, upload.single('avatar'), usersController.updateAvatar)

 

module.exports = router;