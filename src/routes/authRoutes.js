const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrollers");

router.get("[/,home]", (req, res) => res.render("home"));
router.get("/loginform", (req, res) => res.render("loginform"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/routelist", (req, res) => res.render("routelist"));
router.get("/contact", (req, res) => res.render("contact"));
router.get("/about", (req, res) => res.render("about"));
router.get("/gpstracker", (req, res) => res.render("gpstracker"));
router.get("/otp", (req, res) => res.render("otp"));
router.get("/resetpassword", (req, res) => res.render("resetpassword"));
router.get("/forgpass", (req, res) => res.render("forgpass"));





//router.post("/otp",authController.otp);
router.post("/resetpassword",authController.resetpassword);
router.post("/login",authController.login);
router.post("/signup",authController.signup);
router.post("/forgpass",authController.forgpass);




module.exports = router;
