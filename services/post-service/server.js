require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 8014;
app.listen(PORT, () => {
  console.log(`My Postings Service running on port ${PORT}`);
});
