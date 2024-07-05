const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//!Combine Get Index Route & Post Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

//!Combine New Route / Authentication
router.get("/new", isLoggedIn, listingController.renderNewForm);

//! Combine Show Route & Update Route & Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


//!Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


//!Index Route
// router.get("/", wrapAsync(listingController.index));
//!Show Route :- Read(CRUD)
// router.get("/:id", wrapAsync(listingController.showListing));

// //!Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//!Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//!Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;