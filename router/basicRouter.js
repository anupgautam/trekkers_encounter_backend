var express = require('express');
var basic = express.Router();
var language = require('../controller/languageController');
var category = require('../controller/categoryController');
var subCategory = require('../controller/subCategoryController');
var subSubCategory = require('../controller/subsubCategoryController');
var package = require('../controller/packageController');
var itinerary = require('../controller/itineraryController');
var essential = require('../controller/essentialController');
var packageImage = require('../controller/packageImageController')
var faq = require('../controller/faqController');
var faqpackage = require('../controller/faqPackageController');
var includeexclude = require('../controller/includeExcludeController');
var includeexcludepackage = require('../controller/includeExcludedPackageController');
var review = require('../controller/reviewController');
var booking = require('../controller/packageBookingController');
var gallery = require('../controller/packageGalleryController');
var homepage = require('../controller/homePageSliderController');
var about = require('../controller/aboutController');
const multer = require("multer");
var contact = require('../controller/contactController');
var blog = require('../controller/blogController');


// Define storage for multer
var storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/package_images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

// Create multer instances for each API
var upload1 = multer({ storage: storage1 });





//language api
basic.post('/language/', language.postLanguage);
basic.get('/language/', language.getLanguage);
basic.get('/language/:id', language.getLanguageById);
basic.patch('/language/:id/', language.updateLanguage);
basic.delete('/language/:id', language.deleteLanguage);

//category api
basic.post('/category/', category.postCategory);
basic.get('/category/', category.getCategory);
basic.get('/category/:postId', category.getCategoryById);
basic.get('/category_language/:language_id', category.getCategoryByLanguage);
basic.patch('/category/:postId', category.updateCategory);
basic.delete('/category/:postId', category.deleteCategory);


//sub category api
basic.post('/sub_category/', subCategory.postSubCategory)
basic.get('/sub_category/', subCategory.getSubCategory)
basic.get('/sub_category/:postId', subCategory.getSubCategoryById);
basic.get('/sub_category_language/:language_id', subCategory.getSubCategoryByLanguage);
basic.get('/sub_category_category/:category_id', subCategory.getSubCategoryByCategory);
basic.patch('/sub_category/:postId', subCategory.updateSubCategory);
basic.delete('/sub_category/:postId', subCategory.deleteSubCategory);

//sub sub category api
basic.post('/sub_sub_category/',subSubCategory.postSubSubCategory);
basic.get('/sub_sub_category/', subSubCategory.getSubSubCategory);
basic.get('/sub_sub_category/:postId', subSubCategory.getSubSubCategoryById);
basic.get('/sub_sub_category_language/:language_id', subSubCategory.getSubSubCategoryByLanguage);
basic.get('/sub_sub_category_sub_category/:sub_category_id', subSubCategory.getSubSubCategoryByCategory);
basic.patch('/sub_sub_category/:postId', subSubCategory.updateSubSubCategory);
basic.delete('/sub_sub_category/:postId', subSubCategory.deleteSubSubCategory);


//package api 
basic.post('/package/', upload1.single('package_image'), package.postPackage);
basic.get('/package/', package.getPackage);
basic.get('/package/:postId', package.getPackageById);
basic.get('/package_category/:category_id', package.getPackageByCategory);
basic.get('/package_sub_category/:sub_category_id', package.getPackageBySubCategory);
basic.get('/package_sub_sub_category/:sub_sub_category_id', package.getPackageBySubSubCategory);
basic.get('/package_language/:language_id', package.getPackageByLanguage);
basic.patch('/package/:postId', upload1.single('package_image'), package.updatePackage);
basic.delete('/package/:postId', package.deletePackage);


//itinerary api
basic.post('/itinerary/', itinerary.postItinerary);
basic.post('/itinerary_bulk/', itinerary.postBulkItinerary);
basic.get('/itinerary/', itinerary.getItinerary);
basic.get('/itinerary/:postId', itinerary.getItineraryById);
basic.get('/itinerary_package/:package_id', itinerary.getItineraryByPackage);
basic.patch('/itinerary/:postId', itinerary.updateItinerary);
basic.delete('/itinerary/:postId', itinerary.deleteItinerary);


//essential api
basic.post('/essential_information/', essential.postEssential);
basic.post('/essential_information_bulk/', essential.postBulkEssential);
basic.get('/essential_information/', essential.getEssential);
basic.get('/essential_information/:postId', essential.getEssentialById);
basic.get('/essential_information_package/:package_id', essential.getEssentialByPackageId);
basic.patch('/essential_information/:postId', essential.updateEssential);
basic.delete('/essential_information/:postId', essential.deleteEssential);


var storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/other_images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload2 = multer({ storage: storage2 });

//package image api
basic.post('/package_image/', upload2.single('image'), packageImage.postPackageImage);
basic.post('/package_image_bulk/', upload2.array('images', 50), packageImage.postBulkPackageImages);
basic.get('/package_image/', packageImage.getPackageImage);
basic.get('/package_image/:postId', packageImage.getPackageImageById);
basic.get('/package_image_package/:package_id', packageImage.getPackageImageByPackageId);
basic.patch('/package_image/:postId', upload2.single('image'), packageImage.updatePackageImage);
basic.delete('/package_image/:postId', packageImage.deletePackageImage);

//faq api
basic.post('/faq/', faq.postFAQ);
basic.get('/faq/', faq.getFAQ);
basic.get('/faq/:postId', faq.getFaqById);
basic.patch('/faq/:postId', faq.updateFaq);
basic.delete('/faq/:postId', faq.deleteFaq);


//faq package image api
basic.post('/faq_package/', faqpackage.postFaqPackage);
basic.post('/faq_package_bulk/', faqpackage.postBulkFaqPackage);
basic.post('/faq_package_package/', faqpackage.postFaqPackage);
basic.get('/faq_package/', faqpackage.getFaqPackage);
basic.get('/faq_package/:postId', faqpackage.getFaqPackageById);
basic.get('/faq_package_package/:package_id', faqpackage.getFaqByPackage);
basic.patch('/faq_package/:postId', faqpackage.updateFaqPackage);
basic.patch('/faq_package_package/', faqpackage.updateFaqPackageId);
basic.delete('/faq_package/:postId', faqpackage.deleteFaqPackage);


//include exclude image api
basic.post('/include_exclude/', includeexclude.postIncludeExclude);
basic.get('/include_exclude/', includeexclude.getIncludeExclude);
basic.get('/include_exclude/:postId', includeexclude.getIncludeExcludeById);
basic.patch('/include_exclude/:postId', includeexclude.updateIncludeExclude);
basic.delete('/include_exclude/:postId', includeexclude.deleteIncludeExclude);



//include exclude package api
basic.post('/include_exclude_package/', includeexcludepackage.postIncludeExcludePackage);
basic.post('/include_exclude_package_bulk/', includeexcludepackage.postBulkIncludeExcludePackage);
basic.get('/include_exclude_package/', includeexcludepackage.getIncludeExcludePackage);
basic.get('/include_exclude_package/:postId', includeexcludepackage.getIncludeExcludePackageById);
basic.get('/include_exclude_package_package/:package_id', includeexcludepackage.getIncludeExcludePackageByPackage);
basic.patch('/include_exclude_package_package/', includeexcludepackage.updateIncludeExcludePackageId);
basic.patch('/include_exclude_package/:postId', includeexcludepackage.updateIncludeExcludePackage);
basic.delete('/include_exclude_package/:postId', includeexcludepackage.deleteIncludeExcludePackage);

//package review api
basic.post('/review/', review.postReview);
basic.get('/review/', review.getReview);
basic.get('/most/reviewed/', review.getMostReviewedPackages);
basic.get('/review/:postId', review.getReviewById);
basic.get('/review_package/:package_id', review.getReviewByPackage);
basic.patch('/review/:postId', review.updateReview);
basic.delete('/review/:postId', review.deleteReview);


//package booking api
basic.post('/package_booking/', booking.postBooking);
basic.get('/package_booking/', booking.getBooking);
basic.get('/package_booking/:postId', booking.getBookingById);
// basic.get('/package_booking_status/:status', booking.getBookingByStatus);
basic.patch('/package_booking/:postId', booking.updateBooking);
basic.delete('/package_booking/:postId', booking.deleteBooking);


//package gallery booking api


var storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/gallery_images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload3 = multer({ storage: storage3 });

basic.post('/package_gallery/', upload3.single('image'), gallery.postPackageGallery);
basic.post('/package_gallery_bulk/', upload3.array('images', 50), gallery.postBulkPackageGallery);
basic.get('/package_gallery/', gallery.getPackageGallery);
basic.get('/package_gallery/:postId', gallery.getPackageGalleryById);
basic.get('/package_gallery_package/:package_id', gallery.getPackageGalleryByPackage);
basic.patch('/package_gallery/:postId', upload3.single('image'), gallery.updatePackageGallery);
basic.delete('/package_gallery/:postId', gallery.deletePackageGallery);

var storage4 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/home_page/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload4 = multer({ storage: storage4 });

basic.post('/home_page/', upload4.single('slider_image'), homepage.postHomePageSlider);
basic.get('/home_page/', homepage.getHomePageSlider);
basic.get('/home_page/:postId', homepage.getHomePageSliderById);
basic.get('/home_page_language/:language_id', homepage.getHomePageSliderByLanguage);
basic.patch('/home_page/:postId', upload4.single('slider_image'), homepage.updateHomePageSlider);
basic.delete('/home_page/:postId', homepage.deleteHomePageSlider);


//about api
basic.post('/about/', about.postAbout);
basic.get('/about/', about.getAbout);
basic.get('/about/:postId', about.getAboutById);
basic.get('/about_language/:language_id', about.getAboutByLanguage);
basic.patch('/about/:postId', about.updateAbout);
basic.delete('/about/:postId', about.deleteAbout);

//contact api 
basic.post('/contact/', contact.postContact);
basic.get('/contact/', contact.getContact);
basic.get('/contact/:postId', contact.getContactById);
basic.patch('/contact/:postId', contact.updateContact);
basic.delete('/contact/:postId', contact.deleteContact);


//blog api 


var storage5 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './media/blog/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});


var upload5 = multer({ storage: storage5 });

basic.post('/blog/', upload5.single('image'), blog.postBlog);
basic.get('/blog/', blog.getBlog);
basic.get('/blog/:postId', blog.getBlogById);
basic.patch('/blog/:postId', upload5.single('image'), blog.updateBlog);
basic.delete('/blog/:postId', blog.deleteBlog);


module.exports = basic;