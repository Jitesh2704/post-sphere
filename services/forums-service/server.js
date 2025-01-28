require('dotenv').config();
const app = require('./src/app');


const PORT = process.env.PORT || 8012;
app.listen(PORT, () => {
    console.log(`Forum Service running on port ${PORT}`);
});
