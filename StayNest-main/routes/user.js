const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/user")

//! combine GET SignUp & POST SignUp
router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signup));

//! combine GET Login & POST Login
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login));

router.get('/logout', userController.logout);


//!GET SignUp
// router.get("/signup", userController.renderSignUpForm);

//!POST SignUp
// router.post("/signup", wrapAsync(userController.signup));

//!GET Login
// router.get("/login", userController.renderLoginForm);

//!POST Login
// router.post("/login", saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login));

module.exports = router;