const LogInCollection = require("../models/loginModel");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
    try {
        
        const check = await LogInCollection.findOne({email: req.body.email
           
             });
        
        
        if(check.role===req.body.role){
            
      
        
        if (check.password === req.body.password) {
           
                res.render("home");
            
        }
         else {
            res.send(`<script>alert("Wrong password"); window.history.back();</script>`);
        }
    }
        else{
            res.send(`<script>alert("select proper usertype"); window.history.back();</script>`);
        }
    
    } catch(error) {
        console.error("Error during signup:", error);
        res.send(`<script>alert("Something went wrong. Please try again later."); window.history.back();</script>`);
    }
};

exports.signup = async (req, res) => {
    const{Name,email,password,role}=req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({ Name,  email, password: hashedPassword ,role});
        await newUser.save();

        res.status(201).json({ message: "Signup successful!" });

    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};

