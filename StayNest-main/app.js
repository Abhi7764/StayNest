if (process.env.NODE_ENV != 'production') {
  require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  // store: store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 7, //after 1 week cookies are expired
    maxAge: 1000 * 60 * 60 * 7,
    httpOnly: true,
  }
}

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

//!User Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(res.locals.success);
  next();
})

//!listing Router 
app.use("/listings", listingRouter);

//!Review Router
app.use("/listings/:id/reviews", reviewRouter);

//!User Router
app.use("/", userRouter);

//! For all Invalid Request
app.all("*", (req, res, next) => {
  next(new ExpressError("404", "Page Not Found!"));
})

//!Handle Errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

//!Testing Route
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
//!Demo User Route
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "test@example.com",
//     username: "test",
//   });
//   let registeredUser = await User.register(fakeUser, "HelloWorld");
//   res.send(registeredUser);
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});