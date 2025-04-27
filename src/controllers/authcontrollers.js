const LogInCollection = require("../models/loginModel");
const OTPCollection = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "yourSecretKey";

// Password pattern (at least 8 characters, with upper, lower, number, special character)
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Signup function
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await LogInCollection.findOne({ email });

        if (existingUser) {
            return res.send(`<script>alert("User already exists!"); window.history.back();</script>`);
        }

        // Validate password strength
        if (!passwordPattern.test(password)) {
            return res.send(`<script>alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."); window.history.back();</script>`);
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new LogInCollection({
            Name: name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // Redirect to login page after successful signup
        return res.redirect("/login");
    } catch (error) {
        console.error("Error during signup:", error);
        return res.send(`<script>alert("Something went wrong. Please try again later."); window.history.back();</script>`);
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await LogInCollection.findOne({ email });

        if (!user) {
            return res.send(`<script>alert("User not found"); window.history.back();</script>`);
        }

        if (user.role !== role) {
            return res.send(`<script>alert("Select the proper user type"); window.history.back();</script>`);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send(`<script>alert("Wrong password"); window.history.back();</script>`);
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        // Set the token to expire in 1 minute (60 seconds)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "60s" });

        // Set the token in the cookies
        res.cookie('token', token, {
            httpOnly: false, // To allow JavaScript access to cookies
            secure: false, // Set to true if you're using https
            maxAge: 60 * 1000 // Token will expire in 60 seconds
        });

        console.log(token);

        // Redirect to the correct dashboard based on the role
        if (role === "admin") {
            return res.redirect("/admindash");
        } else if (role === "student") {
            return res.redirect("/student/student_home");
        } else if (role === "busincharge") {
            return res.redirect("/bus-incharge/busincharge-dashboard");
        }

    } catch (error) {
        console.error("Error during login:", error);
        return res.send(`<script>alert("Something went wrong. Please try again later."); window.history.back();</script>`);
    }
};

// OTP generation function
exports.otp = async (req, res) => {
    const { email } = req.body;
    const user = await LogInCollection.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(1000, 9999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    await OTPCollection.create({ email, otp, expiresAt });

    console.log(`OTP for ${email}: ${otp}`); // Replace this with email sending logic

    res.json({ message: "OTP sent successfully!" });
};

// Function to verify OTP and reset password
exports.resetpassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await OTPCollection.findOne({ email, otp });

    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Validate new password strength
    if (!passwordPattern.test(newPassword)) {
        return res.status(400).json({ message: "New password must be at least 8 characters long and include uppercase, lowercase, number, and special character." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await LogInCollection.findOneAndUpdate({ email }, { password: hashedPassword });

    await OTPCollection.deleteOne({ email }); // Remove OTP after successful reset

    res.json({ message: "Password updated successfully!" });
};

// Middleware to check if token is expired
exports.checkTokenExpiration = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next();
    } catch (error) {
        console.error("Invalid or expired token:", error);
        res.clearCookie("token"); // Clear cookie
        res.redirect("/login"); // Redirect to login page
    }
};
