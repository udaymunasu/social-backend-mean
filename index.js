// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(express.static("assets"));

// Increase the request size limit using bodyParser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


//CORS Headers Configuration
app.use(bodyParser.json({ limit: '15360mb', extended: true, parameterLimit: 100000000 }));
app.use(bodyParser.urlencoded({ limit: '15360mb', extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});


// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/red_social_app').then(() => {
    console.log("Database connected successfully");

})
    .catch(err => console.log(err));


// Routes
app.use('/', require('./routes/users'));
app.use('/', require('./routes/articles'));

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
