const Joi = require('joi');

const createEventSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  datetime: Joi.date().iso().required(),
  location: Joi.string().trim().min(1).required(),
  capacity: Joi.number().integer().min(1).max(1000).required()
});

const registerSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  eventId: Joi.number().integer().positive().required()
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validate, createEventSchema, registerSchema };