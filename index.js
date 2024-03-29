const express = require('express');
const router = require('./src/Routes');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
// Monta el enrutador en las rutas base
app.use('/users', router);
app.use('/doctors', router);
app.use('/appointments', router);

app.listen(3001, () => {
    console.log('Server on port 3001');
});

const dbConnect = require('./src/ConfigDB');
dbConnect();