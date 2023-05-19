const express = require('express')

const contactsController = require('../../controllers/contact-controller');

const schemas = require('../../schemas/contacts-schemas');

const { isValidId } = require('../../decorators/');
const { validateUpdate } = require('../../decorators/validateBody');
const { validateBody } = require('../../decorators/validateBody');

const router = express.Router()



router.get('/', contactsController.listContacts);

router.get('/:id', isValidId, contactsController.getContactById);

router.post('/', validateBody(schemas.contactAddSchema), contactsController.addContact);

router.delete('/:id', isValidId, contactsController.removeContact);

router.put('/:id', isValidId, validateBody(schemas.contactAddSchema), contactsController.updateContact);

router.patch('/:id/favorite', isValidId, validateUpdate(schemas.updateFavoriteSchema), contactsController.updateStatusContact);


module.exports = router
