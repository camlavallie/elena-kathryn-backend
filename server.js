const express = require('express');
const cors = require("cors");
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Init middleware

app.use(express.json({extended: false}))

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use(cors());
app.use('/api/users', require('./routes/API/users'));
app.use('/api/auth', require('./routes/API/auth'));
app.use('/api/profile', require('./routes/API/profile'));
app.use('/api/posts', require('./routes/API/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));