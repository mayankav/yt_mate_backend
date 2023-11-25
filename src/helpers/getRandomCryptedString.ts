const crypto = require("crypto");
export default function getRandomCryptedString() {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
}
