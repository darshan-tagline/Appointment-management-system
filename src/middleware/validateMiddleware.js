const sendResponse = require("../utils/responseUtils");

const validate = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(
      { ...req.body, ...req.query, ...req.params },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );
    if (error) {
      console.log(`error: ${error}`);
      return sendResponse(res, 400, error.message);
    }
    next();
  } catch (err) {
    return sendResponse(res, 500, responseMessage.INTERNAL_SERVER);
  }
};
