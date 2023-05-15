const { HttpError } = require("../helpers");

const validateBody = schema => {
    const func = (req, res, next) => {
         const empty = JSON.stringify(req.body) === '{}';
        if (empty) {
            next(HttpError(400, 'missing fields'));
        }
         const { error } = schema.validate(req.body);
    if (error) {
      next (HttpError(400, error.message));
        }
        next();
    }
    return func;
}

module.exports = {
    validateBody,
}