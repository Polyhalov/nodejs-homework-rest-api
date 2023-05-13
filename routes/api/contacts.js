const express = require('express')

const contactsController = require('../../controllers/contact-controller');

const router = express.Router()

router.get('/', contactsController.listContacts);

router.get('/:id', contactsController.getContactById);

router.post('/', contactsController.addContact);

router.delete('/:id', contactsController.removeContact);

router.put('/:id', contactsController.updateContact);

module.exports = router
