const User = require("../models/user");

//!render signup from
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

//!POST SignUp
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to the WanderLust");
            res.redirect("/listings")
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

//!render login from
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

//!Post Login
module.exports.login = async (req, res) => {
    // let { username, password } = req.body;
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

//!LogOut user
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("listings");
    })
}