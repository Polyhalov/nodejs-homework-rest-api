

const contactsService = require('../models/contacts');

const { HttpError } = require('../helpers');

const listContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

const getContactById= async (req, res, next) => {
try {
    const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, 'Not found'); 
  }
  res.json(result);
} catch (error) {
  next(error);
}
}
const addContact= async (req, res, next) => {
  try {
     const result = await contactsService.addContact(req.body);
     res.status(201).json(result);
   } catch (error) {
     next(error);
   }
}

const removeContact=async (req, res, next) => {
try {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
      throw HttpError(404, 'Not found');
  }
  res.status(200).json({ message: "contact deleted" });
} catch (error) {
  next(error);
}}
const updateContact= async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
    
  } catch (error) {
    next(error);
  }
}




module.exports = {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
}
