

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const registerRoute = require('./routes/auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
const MONGO_URI = 'mongodb://localhost:27017/imtaiz';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', registerRoute);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
