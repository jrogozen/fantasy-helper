function httpResourceNotFound(message, isCriticalError = false, additional) {
  let base = {
    success: !isCriticalError,
  };

  if (!isCriticalError) {
    base = {
      ...base,
      data: null,
      message,
    };
  } else {
    base = {
      error: message,
    };
  }

  const extended = {
    ...base,
    ...additional,
  };

  if (process.env !== 'production') {
    return extended;
  }

  return base;
}

module.exports = httpResourceNotFound;
