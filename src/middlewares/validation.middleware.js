import { AppError } from "../Utils/index.js";

/**
 * @param {object} schema - Joi schema object
 * @returns  {Function} - Middleware function
 * @description - Middleware function to validate the request data against the schema
 */

const reqKeys = ["body", "query", "params", "headers"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    // Initialize validation errors array
    const validationErrors = [];

    for (const key of reqKeys) {
      // Validate the request data against the schema of the same key
      const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false,
      });

      // If there is an error, push the error details to the validationErrors array
      if (validationResult?.error) {
        validationErrors.push(...validationResult?.error?.details);
      }
    }

    validationErrors.length
      ? next(new AppError("Validation Error", 400, validationErrors)) //TODO  I WANT TO ADD THIRD PARAMETER IN AppError Class for data
      : next();
  };
};
