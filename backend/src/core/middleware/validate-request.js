const ApiError = require('../errors/api-error');

function parseSection(schema, input, sectionName) {
  if (!schema) {
    return input;
  }

  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new ApiError(400, `Invalid ${sectionName}.`, parsed.error.flatten());
  }

  return parsed.data;
}

function validateRequest(schemas = {}) {
  return (req, res, next) => {
    try {
      req.validated = {
        params: parseSection(schemas.params, req.params, 'route params'),
        query: parseSection(schemas.query, req.query, 'query params'),
        body: parseSection(schemas.body, req.body, 'request body')
      };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = validateRequest;
