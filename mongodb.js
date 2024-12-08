const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/SAMPLE_PRJ")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    userType:{
        type:String,
        required:true,
        enum:['admin','bus incharge']
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})




const paymentSchema = new mongoose.Schema({
    email: { type: String, required: true },
    route: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentId: { type: String},
    orderId: { type: String, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

const LogInCollection=new mongoose.model('LogInCollection',logInSchema);
const PaymentCollection= new mongoose.model('PaymentCollection', paymentSchema);

module.exports = {LogInCollection,PaymentCollection};

