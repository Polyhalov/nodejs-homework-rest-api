const express = require('express')

const contactsController = require('../../controllers/contact-controller');

const schemas = require('../../schemas/contacts-schemas');

const { validateBody } = require('../../decorators/validateBody');

const router = express.Router()



router.get('/', contactsController.listContacts);

router.get('/:id', contactsController.getContactById);

router.post('/', validateBody(schemas.contactAddSchema), contactsController.addContact);

router.delete('/:id', contactsController.removeContact);

router.put('/:id', validateBody(schemas.contactAddSchema), contactsController.updateContact);

module.exports = router
