const Joi = require("joi");

const appointmentValidator = Joi.object({
  doctorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Doctor ID must be a valid ObjectId.",
      "any.required": "Doctor ID is required.",
    }),
  date: Joi.date()
    .greater("now") 
    .messages({
      "date.base": "Date must be a valid date.",
      "date.greater": "Date must be in the future.",
      "any.required": "Date is required.",
    }),
  timeSlot: Joi.string()
    .required()
    .custom((value, helpers) => {
      const timeSlotRegex = /^([0-9]{1,2})-([0-9]{1,2})$/;
      const match = value.match(timeSlotRegex);

      if (!match) {
        return helpers.message(
          "Time slot must be in the format 'HH-HH' where HH are hours between 00 and 23."
        );
      }

      const startHour = parseInt(match[1], 10);
      const endHour = parseInt(match[2], 10);

      if (startHour < 0 || startHour >= 24 || endHour < 0 || endHour >= 24) {
        return helpers.message("Hours must be between 00 and 23.");
      }

      if (startHour >= endHour) {
        return helpers.message(
          "Start time must be less than end time (e.g., '12-13' is valid, '13-12' is not)."
        );
      }

      return value;
    })
    .messages({
      "string.empty": "Time slot cannot be empty.",
      "any.required": "Time slot is required.",
    }),
  symptoms: Joi.string().optional().messages({
    "string.empty": "Symptoms cannot be an empty string.",
  }),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional()
    .messages({
      "string.empty": "Status cannot be an empty string.",
      "any.only": "Status must be one of 'pending', 'approved', or 'rejected'.",
    }),
});

module.exports = appointmentValidator;
