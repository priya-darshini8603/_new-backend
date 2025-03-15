require('dotenv').config();
const express = require('express');
const app = express();

const http=require('http')
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');

const bodyParser = require('body-parser');
const mongoose = require('./mongodb');

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const trackerRoutes = require('./routes/trackerRoutes');
const templatepath = path.join('template');
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





const config = require('./config/razorpay');

const io = socketIo(server);
//app.use(express.static('public'));
//app.use(express.static('static'));
app.use(bodyParser.json());
app.use('/api/location',trackerRoutes);
app.get('/bus-incharge/:page', (req, res) => res.render(`bus-incharge/${req.params.page}`));
app.use('/bus-incharge/js', express.static('src/bus-incharge'));
app.use('/js', express.static('src'));



// Export io to use in other files






app.use(authRoutes);
app.use(paymentRoutes);



app.listen(4000, () => {
  console.log('Server running on port 4000');
});
