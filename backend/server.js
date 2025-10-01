require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // in prod: configure allowed origin(s)
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/application', require('./routes/application'));
app.use('/api/auth', require('./routes/authRoutes'));

// Optionally serve frontend (after build) from backend:
// app.use(express.static('../frontend'));
// app.get('*', (req,res) => res.sendFile(path.resolve(__dirname,'../frontend','index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
