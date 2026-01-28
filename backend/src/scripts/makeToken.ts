import "dotenv/config"; // load dotenv environment
import { generateToken } from "../utils/generateToken";

// get id from argument
const id = process.argv[2];

if (!id) {
  console.error("Usage: ts-node src/scripts/makeToken.ts <USER_ID>");
  process.exit(1);
}

// generate the token
const token = generateToken(id);

console.log("JWT:", token);
