const express = require('express');
const connectDB = require('./config/db');

//Create server
const app = express();

//Connect with the DB
connectDB();

//App's port
const PORT = process.env.PORT || 4000;

//Start the app
app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
});