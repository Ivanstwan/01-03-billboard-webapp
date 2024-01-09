import bcrypt from 'bcrypt';
const saltRounds = 10;

// Function to hash a password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
}

// Function to compare entered password with hashed password
async function comparePasswords(enteredPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
}

export { hashPassword, comparePasswords };
