const express = require('express');
const router = require('./src/Routes');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
// Monta el enrutador en las rutas base
app.use('/users', router);
app.use('/doctors', router);
app.use('/appointments', router);

app.listen(3000, () => {
    console.log('Server on port 3000');
});

const dbConnect = require('./src/ConfigDB');
dbConnect();