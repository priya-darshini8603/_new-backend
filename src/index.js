require('dotenv').config();
const express = require('express');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');
const http = require('http');
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('./mongodb');
const Message = require('./models/Message');

// ✅ Import Routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const businchargeRoutes = require('./routes/businchargeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationroutes');

// ✅ Middleware FIRST - parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// ✅ Session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/SAMPLE_PRJ',
    ttl: 60 * 60
  }),
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    res.locals.user = req.session.user;
  }
  next();
});

// ✅ Static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Views
const templatepath = path.join('template');
app.set('view engine', 'hbs');
app.set('views', templatepath);

hbs.registerHelper('encodeURIComponent', str => encodeURIComponent(str));
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});
hbs.registerHelper('formatTime', function (timestamp) {
  return moment(timestamp).fromNow(); // e.g., "3 minutes ago"
});

// ✅ Register routes AFTER body parsers
app.use('/api/notifications', notificationRoutes);
app.use(authRoutes);
app.use(paymentRoutes);
app.use(businchargeRoutes);
app.use(adminRoutes);

// ✅ Extra static
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

app.use('/js', express.static('public/javascript'));
app.use('/js', express.static('src'));

app.get('/admin/:page', (req, res) => res.render(`admin/${req.params.page}`));
app.use('/admin/js', express.static('public/javascript/admin'));

app.use('/images', express.static('public/images'));
app.use('/', express.static('public/css/admin'));
app.use(express.static('public/css'));

// ✅ Socket.io setup
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const users = {};

io.on("connection", socket => {
  console.log("New user connected");

  socket.on("register", email => {
    users[email] = socket.id;
    socket.email = email;
    console.log("Registered:", email);
  });

  socket.on("chatMessage", async ({ sender, receiver, text }) => {
    if (!sender || !receiver || !text) return;
    const newMsg = await Message.create({ sender, receiver, text });
    const time = new Date(newMsg.createdAt).toLocaleTimeString();

    io.to(users[sender])?.emit("message", { user: "isMe", text, time });
    if (users[receiver]) {
      io.to(users[receiver]).emit("message", { user: sender, text, time });
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
