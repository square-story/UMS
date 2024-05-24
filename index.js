const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/user_management_system', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const express = require('express');
const app = express();



//add nocache for session handiling
const nocache = require("nocache");
app.use(nocache());

// For user routes
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// For admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something wrong');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
