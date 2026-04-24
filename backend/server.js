
require('./src/config/db');

const app = require('./src/app');

const PORT = 5000;


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
