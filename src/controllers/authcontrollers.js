const LogInCollection = require("../models/loginModel");
const ProfileCollection = require("../models/profileModel");
const OTPCollection = require("../models/otpModel");
const contactCollection=require("../models/Contact");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "yourSecretKey";
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


exports.signup = async (req, res) => {
  try {
    const { fName, lName, email, password, role } = req.body;

    // Check for existing user
    const existingUser = await LogInCollection.findOne({ email });
    if (existingUser) {
      return res.send('<script>alert("User already exists!"); window.history.back();</script>');
    }

    if (!passwordPattern.test(password)) {
      return res.send(`<script>alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."); window.history.back();</script>`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new LogInCollection({
      fName,
      lName,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();

    // Also save to profile collection
    await new ProfileCollection({ fName, lName, email, role }).save();

    res.redirect("/loginform");
  } catch (error) {
    console.error("Error during signup:", error);
    res.send('<script>alert("Something went wrong. Please try again later."); window.history.back();</script>');
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await LogInCollection.findOne({ email });

    if (!user) {
      return res.send('<script>alert("User not found"); window.history.back();</script>');
    }

    if (user.role !== role) {
      return res.send('<script>alert("Select the proper user type"); window.history.back();</script>');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('<script>alert("Wrong password"); window.history.back();</script>');
    }

    // Save user info in session
    req.session.user = {
      _id: user._id.toString(),     // ✅ CRITICAL: save _id for notifications
      email: user.email,
      role: user.role
    };

    // Create JWT
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      maxAge: 3600000
    });

    // Redirect
    if (role === "admin") {
      return res.redirect("/admin/admindashboard");
    } else if (role === "student") {
      return res.redirect("/student/student_home");
    } else if (role === "busincharge") {
      return res.redirect("/bus-incharge/busincharge-dashboard");
    } else {
      return res.redirect("/teacher/teacherhome");
    }

  } catch (error) {
    console.error("Error during login:", error);
    res.send('<script>alert("Something went wrong. Please try again later."); window.history.back();</script>');
  }
};


exports.forgpass = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await LogInCollection.findOne({ email });
    if (!user) {
      return res.redirect('/loginform');
    }

    const otp = crypto.randomInt(1000, 9999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await OTPCollection.create({ email, otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'paaani2004@gmail.com',
        pass: 'adko nuwa nyus ogvp'
      }
    });

    const mailOptions = {
      from: '1nt22cs129.pavani@nmit.ac.in',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: 'Failed to send OTP email!' });
      }
      console.log('OTP email sent: ' + info.response);
      res.render('otp', { email });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.verifyotp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await OTPCollection.findOne({ email });

    if (!record || record.otp !== otp || new Date() > record.expiresAt) {
      return res.render("otp", { email, message: "Invalid or expired OTP." });
    }

    res.render("resetpassword", { email });
  } catch (error) {
    console.error(error);
    res.render("otp", { email, message: "Server error verifying OTP." });
  }
};


exports.resetpassword = async (req, res) => {
  const { email, newpassword, confirmpassword } = req.body;
  try {
    if (newpassword !== confirmpassword) {
      return res.render("resetpassword", { email, message: "Passwords do not match." });
    }

    const user = await LogInCollection.findOne({ email });
    if (!user) {
      return res.render("resetpassword", { email, message: "User not found." });
    }

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();

    res.redirect("/loginform");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).render("resetpassword", { email, message: "Something went wrong. Try again." });
  }
};

// ========================== CHECK TOKEN ==========================
exports.checkTokenExpiration = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/loginform");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid or expired token:", error);
    res.clearCookie("token");
    res.redirect("/loginform");
  }
};
