function splitCohort(input) {
  const regex = /(.*?)(?:\s*\/\s*)?(\d{4})/;
  const match = input.match(regex);

  if (match) {
    // eslint-disable-next-line no-unused-vars
    let [_, rest, year] = match;
    if (rest) {
      rest = rest.replace(/\s*\/\s*/g, "/");
    }
    return [rest, year];
  }
  return [null, null];
}

module.exports = splitCohort;
