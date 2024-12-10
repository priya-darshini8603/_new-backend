require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');
const mongoose = require('./mongodb');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const config = require('./config/razorpay');
const templatepath = path.join('template');

app.use(express.static('public'));
app.use(express.static('static'));



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', templatepath);


app.use(authRoutes);
app.use(paymentRoutes);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
