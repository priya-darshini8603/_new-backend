require('dotenv').config();
const express = require('express');
const app = express();

const http=require('http')
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const config = require('./config/razorpay');

const bodyParser = require('body-parser');
const mongoose = require('./mongodb');


const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const gpsRoutes = require('./routes/gpsroute');
const templatepath = path.join('template');
const otpRoutes = require("./routes/otpRoutes");
app.use("/api/otp", otpRoutes);

const server = http.createServer(app);
//praser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//static files location
app.use(express.static(path.join(__dirname, 'public')));

//view engine
app.set('view engine', 'hbs');
app.set('views', templatepath);

app.use(authRoutes);
app.use(paymentRoutes);
app.use(gpsRoutes);



//app.use(express.static('public'));
//app.use(express.static('static'));
app.use(bodyParser.json());


app.get('/bus-incharge/:page', (req, res) => res.render(`bus-incharge/${req.params.page}`));
app.use('/bus-incharge/js', express.static('public/javascript/bus-incharge'));
app.use('/images', express.static('public/images'));
app.use('/', express.static('public/css/bus-incharge'));
app.use(express.static('public/css'));
app.use('/js', express.static('public/javascript'));
app.use('/js', express.static('src'));

app.get('/student/:page', (req, res) => res.render(`student/${req.params.page}`));
app.use('/student/js', express.static('public/javascript/student'));
app.use('/', express.static('public/css/student'));

app.get('/admin/:page', (req, res) => res.render(`admin/${req.params.page}`));
app.use('/admin/js', express.static('public/javascript/admin'));
app.use('/', express.static('public/css/student'));


app.listen(4000, () => {
  console.log('Server running on port 4000');
});
