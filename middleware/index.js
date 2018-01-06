var Comment = require("../models/comment");
var Campground = require("../models/campground");
/*
*Middleware runs after a request is received, but before a response is sent back.
* In this example the body-parser package is used as middleware.
* It converts incoming requests into a format that is easy to use for a JS program.

Middleware functions can be chained after each other and fit into the request/response cycle of the application.
When writing custom middleware, next() always has to be called at the end of that middleware to move to the next one in the cycle.
*
*
* */



module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkUserCampground: function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    console.log("BADD!!!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
        }
    }
}