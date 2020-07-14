const express = require('express');
const connectDB = require('./config/db');

//Create server
const app = express();

//Connect with the DB
connectDB();

// Habilitar express.json
app.use( express.json({ extended: true }) );

//App's port
const PORT = process.env.PORT || 4000;

//Import routers
app.use('/api/negocio/create/', require('./routes/negocio'));
app.use('/api/rubro/create/', require('./routes/rubro'));

//Start the app
app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
});