const express = require('express')

const contactsController = require('../../controllers/contact-controller');

const schemas = require('../../schemas/contacts-schemas');

const { isValidId, authenticate } = require('../../decorators/');
const { validateUpdate } = require('../../decorators/validateBody');
const { validateBody } = require('../../decorators/validateBody');

const router = express.Router()



router.get('/', authenticate, contactsController.listContacts);

router.get('/:id', authenticate, isValidId, contactsController.getContactById);

router.post('/', authenticate, validateBody(schemas.contactAddSchema), contactsController.addContact);

router.delete('/:id', authenticate, isValidId, contactsController.removeContact);

router.put('/:id', authenticate, isValidId, validateBody(schemas.contactAddSchema), contactsController.updateContact);

router.patch('/:id/favorite', authenticate, isValidId, validateUpdate(schemas.updateFavoriteSchema), contactsController.updateStatusContact);


module.exports = router
