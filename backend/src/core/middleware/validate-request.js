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
      if (req.log) {
        req.log('validation:start', {
          sections: Object.keys(schemas),
          params: req.params,
          query: req.query,
          body: req.body
        });
      }

      req.validated = {
        params: parseSection(schemas.params, req.params, 'route params'),
        query: parseSection(schemas.query, req.query, 'query params'),
        body: parseSection(schemas.body, req.body, 'request body')
      };

      if (req.log) {
        req.log('validation:success', { validated: req.validated });
      }

      return next();
    } catch (error) {
      if (req.log) {
        req.log('validation:error', { error }, 'warn');
      }

      return next(error);
    }
  };
}

module.exports = validateRequest;
