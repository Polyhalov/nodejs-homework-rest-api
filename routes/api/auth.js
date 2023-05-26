const express = require('express');

const { validateBody } = require('../../decorators/validateBody');

const usersController = require('../../controllers/auth');

const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), usersController.register);

router.post('/login', validateBody(schemas.loginSchema),usersController.login);

// validateBody(schemas.registerSchema)

module.exports = router;