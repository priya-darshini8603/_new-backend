const LogInCollection = require("../models/loginModel");
const OTPCollection = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


exports.signup = async (req, res) => {
    
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await LogInCollection.findOne({ email });

        if (existingUser) {
            return res.send(`<script>alert("User already exists!"); window.history.back();</script>`); 
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

        // Redirect to the correct dashboard based on the role
        if (role === "admin") {
            return res.redirect("/admindash");
        } else if (role === "student") {
            return res.redirect("/student-dashboard");
        } else if (role === "busincharge") {
            return res.redirect("/bus-incharge/busincharge-dashboard");
        }

    } catch (error) {
        console.error("Error during login:", error);
        return res.send(`<script>alert("Something went wrong. Please try again later."); window.history.back();</script>`);
    }
};

exports.otp= async (req, res) => {
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
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await LogInCollection.findOneAndUpdate({ email }, { password: hashedPassword });
  
    await OTPCollection.deleteOne({ email }); // Remove OTP after successful reset
  
    res.json({ message: "Password updated successfully!" });
  };
    

