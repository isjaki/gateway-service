const express = require('express');
const mongoose = require('mongoose');

const gatewayRouter = require('./routes/gateway');

const app = express();

app.use(express.json());

app.use('/gateway', gatewayRouter);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);

    try {
        mongoose.connect('mongodb://localhost:27017/test');
    } catch (e) {
        console.log(e);
    }
});
