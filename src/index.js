require('dotenv').config();
const express = require('express');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    
    mongoUrl: 'mongodb://localhost:27017/SAMPLE_PRJ',
    ttl: 60 * 60// session time to live in seconds
  }),
  cookie: {
    maxAge: 60 * 60 * 1000  // 1 hour = 60 min * 60 sec * 1000 ms
  }
}));

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user; // ✅ accessible in routes
    res.locals.user = req.session.user; // ✅ accessible in HBS
  }
  next();
});
const http=require('http')


const path = require('path');
const hbs = require('hbs');
hbs.registerHelper('encodeURIComponent', str => encodeURIComponent(str));
const cors = require('cors');
const nodemailer = require('nodemailer');
const config = require('./config/razorpay');

const bodyParser = require('body-parser');
const mongoose = require('./mongodb');



const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const businchargeRoutes=require('./routes/businchargeRoutes');
const adminRoutes=require('./routes/adminRoutes');

const templatepath = path.join('template');

const cookieParser = require('cookie-parser');
app.use(cookieParser());



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
app.use(businchargeRoutes);
app.use(adminRoutes);
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});



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

const Message = require('./models/Message');
//for chatting
const { Server } = require('socket.io');
const server = http.createServer(app);
const io=new Server(server);
// Socket.IO
const users = {}; // Map email → socket.id

io.on("connection", socket => {
  console.log("New user connected");

  // Register user email when socket connects
  socket.on("register", email => {
    users[email] = socket.id;
    socket.email = email;
    console.log("Registered:", email);
  });

  // Handle chat message
  socket.on("chatMessage", async ({ sender, receiver, text }) => {
    if (!sender || !receiver || !text) return;

    const newMsg = await Message.create({ sender, receiver, text });
    const time = new Date(newMsg.createdAt).toLocaleTimeString();

    // Send to sender
    io.to(users[sender])?.emit("message", {
      user: "isMe",
      text,
      time
    });

    // Send to receiver if online
    if (users[receiver]) {
      io.to(users[receiver]).emit("message", {
        user: sender,
        text,
        time
      });
    }
  });

  socket.on("disconnect", () => {
    if (socket.email) delete users[socket.email];
    console.log("User disconnected:", socket.email);
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
