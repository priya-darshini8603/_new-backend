const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/SAMPLE_PRJ")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

