const LogInCollection = require("../models/loginModel");

exports.login = async (req, res) => {
    try {
        
        const check = await LogInCollection.findOne({name: req.body.name
           
             });
        
        
        if(check.userType===req.body.userType){
            
      
        
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
    try {
        const { userType, name, password } = req.body;
        const checking = await LogInCollection.findOne({ name:name });
        if (checking) {
            return res.send("User details already exist.");
        } else {
            const user = new LogInCollection({userType, name, password });
            await user.save();
            res.redirect('login');
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("An error occurred while processing the request.");
    }
};

