const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

//!Validation for Login Users
module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.path, "....", req.originalUrl);
    if (!req.isAuthenticated()) {
        //redirectUrl Save user Not logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

//!Save redirect url after your are coming from here
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//!Validation for rights of Owner
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//!Validation for review Author 
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash('error', "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//!Validation for Listings
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
}

//!Validation for reviews
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
}