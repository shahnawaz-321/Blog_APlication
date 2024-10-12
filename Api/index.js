const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieparser = require('cookie-parser');
app.use(cookieparser());
require('dotenv').config();

const port = process.env.PORT;
const cors = require('cors');
const router = require('./Routes/UserRoute');
const router1 = require('./Routes/PostRoutes');

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${port}`);
});

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    // Removed useUnifiedTopology as it's no longer necessary
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use('/api', router);
app.use('/api/v2', router1);
