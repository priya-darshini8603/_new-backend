const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
     userType: { type: String, required: true, enum: ['admin', 'busIncharge']},
    name: { type: String, required: true },
    password: { type: String, required: true },
   
    
     
    
});

const LogInCollection = mongoose.model("LogInCollection", loginSchema);
module.exports= LogInCollection;


