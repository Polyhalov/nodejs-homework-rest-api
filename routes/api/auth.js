const express = require('express');

const { validateBody } = require('../../decorators/validateBody');

const { authenticate } = require('../../decorators');

const usersController = require('../../controllers/auth');

const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), usersController.register);

router.post('/login', validateBody(schemas.loginSchema), usersController.login);

router.get('/current', authenticate, usersController.getCurrent);

router.post('/logout', authenticate, usersController.logout);

 

module.exports = router;