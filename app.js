const express = require("express");
const mongoose = require("mongoose");
const app = express();

//import route file
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
const path = require('path');

//connect mongoose to our app
mongoose
    .connect(
        "mongodb+srv://tmostowfi:07.11aZBn@openclassroomcluster.5u5i4.mongodb.net/?retryWrites=true&w=majority&appName=OpenClassRoomCluster",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

//allow manipulation of body in requests
app.use(express.json());

//Allow requests between different server, disabling CORS
app.use((req, res, next) => {
    //allow access to our API from anywhere
    res.setHeader("Access-Control-Allow-Origin", "*");
    //add specified headers to each request sent to our API
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    //allow requests with specified methods
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

//we give the initial routes to route files
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
