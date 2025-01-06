const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrollers");
router.get("[/,home]", (req, res) => res.render("home"));
router.get("/login", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/routelist", (req, res) => res.render("routelist"));
router.get("/contact", (req, res) => res.render("contact"));
router.get("/about", (req, res) => res.render("about"));
router.get("/track",(req,res)=>res.render("tracker"));
router.post("/login",authController.login);
router.post("/signup",authController.signup);



module.exports = router;
