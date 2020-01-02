function stringPossiblyBoolean(value) {
  if (value === 'false') {
    return false;
  }
  if (value === 'true') {
    return true;
  }
  return value;
}

module.exports = {
  stringPossiblyBoolean,
};
