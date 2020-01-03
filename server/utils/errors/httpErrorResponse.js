function httpErrorResponse(error) {
  const base = {
    success: false,
    error: error.message,
  };
  const errorProperties = {};

  Object.getOwnPropertyNames(error).forEach((name) => {
    errorProperties[name] = error[name];
  });

  const extended = {
    ...base,
    error: errorProperties,
  };

  if (error.response) {
    extended.response = JSON.stringify(error.response.data);
  }

  if (process.env.NODE_ENV !== 'production') {
    return extended;
  }

  return base;
}

module.exports = httpErrorResponse;
