const  express =require("express")
const app =express()
const path= require("path")
const hbs=require("hbs")
const templatepath=path.join(__dirname,'../template')

app.use(express.static(path.join(__dirname, '../static')));
app.use(express.static(path.join(__dirname, '../public/admindash')));


const collection=require("./mongodb")
app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatepath)
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.get("/admindash",(req,res)=>{
    res.render("admindash");
})
app.get("/contact",(req,res)=>{
    res.render("contact");
})
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/payment",(req,res)=>{
    res.render("payment");
})
app.get("/routelist",(req,res)=>{
    res.render("routelist");
})


app.post("/login",async(req,res)=>{

   

   try{
   const check=await collection.findOne({name:req.body.name})
    if(check.password===req.body.password){
     res.render("home")
   }
    else{
        res.send("wrong password")
   }
   
   }catch{
    res.send("wrong details")

   }
  

})

app.post('/signup', async (req, res) => {
    
    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    try {
        const data = {
            name: req.body.name,
            password: req.body.password,
        };
    
        // Check if the user already exists
        const checking = await collection.findOne({ name: req.body.name });
    
        if (checking) {
            if (checking.password === req.body.password && checking.name===req.body.name) {
                res.send("User details already exist");
            } else {
                res.send("Username already exists with a different password");
            }
        } else {
            // Insert the new user
            await collection.insertMany([data]);
            res.send("User registered successfully");
        }
        
    } catch (error) {
        console.error("Error during user registration:", error.message);
        res.status(500).send("An error occurred while processing the request");
    }
    

   res.status(201).render("home", {
        naming: req.body.name
   })
})

app.listen(3000,()=>{
    console.log("port connected")
})