const bcrypt = require("bcrypt");

async function generateHash() {
  const hash = await bcrypt.hash("Panu@1603", 10);
  console.log(hash);
}

generateHash();
