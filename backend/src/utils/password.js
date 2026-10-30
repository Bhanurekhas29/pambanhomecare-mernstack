const MIN_PASSWORD = 8;

// Returns a message when the password is too weak, nothing when it is fine
exports.passwordProblem = (password) => {
  const rules = 'at least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character (such as @ # $ !)';
  if (
    !password || password.length < MIN_PASSWORD
    || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)
  ) {
    return `Password must have ${rules}`;
  }
  return undefined;
};
