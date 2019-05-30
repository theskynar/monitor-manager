const Joi = require('joi');

const schema = Joi.object({
    deviceId: Joi.string().required(),
    userId: Joi.string().required(),
    temperature: Joi.number().required(),
    humidity: Joi.number().required()
}).required();

module.exports = schema;