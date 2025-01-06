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
const socketIo = require('socket.io');


const config = require('./config/razorpay');
const templatepath = path.join('template');
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static('public'));
app.use(express.static('static'));
app.use(bodyParser.json());



// Export io to use in other files
module.exports.io = io;
io.on('connection', (socket) => {
  console.log('New client connected');
  
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', templatepath);


app.use(authRoutes);
app.use(paymentRoutes);
app.get("tracker",function(req,res){
  res.render("hey")
})


app.listen(4000, () => {
  console.log('Server running on port 4000');
});
