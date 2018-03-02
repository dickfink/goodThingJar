var express = require('express');
var expressSanitizer = require("express-sanitizer");
var router = express.Router();
var User = require("../models/users");
var Goodthing = require("../models/goodthings");
var mongoose = require("mongoose");

router.use(expressSanitizer());
/* GET all a user's goodThings, and let page. */
router.get('/', function(req, res, next) {
  User.findOne({
    email: "bob@gmail.com"
  }).populate("goodthings").exec(function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.render('goodthings', {
        title: 'Good Thing Jar - One',
        posts: user.goodthings,
        username: user.name
      });
    }
  });
});

/* GET index page */
router.get('/all', function(req, res, next) {
  User.findOne({
    email: "bob@gmail.com"
  }).populate("goodthings").exec(function(err, user) {
    if (err) {
      console.log(err)
    } else {
      res.render('all', {
        title: 'Good Thing Jar',
        posts: user.goodthings,
        username: user.name
      });
      console.log(user);
    }
  });
});

// CREATE
router.post('/', function(req, res) {
  var memory = req.sanitize(req.body.memory);
  var date = new Date();
  var newMessage = {
    author: "Dick Fink",
    memory: memory,
    date: date
  };
  console.log(newMessage);
  Goodthing.create(newMessage, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //    Adds a reference to the post in the currently logged in user:
      User.findOne({
        email: "bob@gmail.com"
      }, function(err, foundUser) {
        if (err) {
          console.log(err);
        } else {
          foundUser.goodthings.push(newlyCreated._id);
          foundUser.save(function(err, data) {
            if (err) {
              console.log(err)
            } else {
              res.redirect('/');
            }
          });
        }
      });
    }
  });
});

router.get('/new', function(req, res, next) {
  //   User.create({
  //     email: "bob@gmail.com",
  //     name: "Bob Belcher"
  //   });
  User.findOne({
    email: "bob@gmail.com"
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('new', {
        title: 'Good Thing Jar - New Post',
        username: user.name
      });
    }
  });
});

router.get('/:id', function(req, res, next) {
  User.findOne({
    email: "bob@gmail.com"
  }).populate("goodthings").exec(function(err, user, postId) {
    Goodthing.findById(req.params.id, function(err, postData) {
      if (err) {
        console.log(err);
      } else {
        console.log(user.goodthings);
        res.render('onegoodthing', {
          title: 'Good Thing Jar - One',
          posts: postData,
          username: user.name
        });
      }
    });
  });
});

// EDIT A POST
router.get('/:id/edit', function(req, res, next) {
  User.findOne({
    email: "bob@gmail.com"
  }).populate("goodthings").exec(function(err, user, postId) {
    Goodthing.findById(req.params.id, function(err, postData) {
      if (err) {
        console.log(err);
      } else {
        res.render('edit', {
          title: 'Good Thing Jar - Edit',
          posts: postData,
          username: user.name
        });
      }
    });
  });
});

// UPDATE ROUTE
router.put("/:id", function(req, res) {
  Goodthing.update({
    _id: req.params.id
  }, {
    memory: req.sanitize(req.body.memory)
  }, function(err, updatedGoodThing) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      res.redirect("/" + req.params.id);
    }
  })
});

// DELETE ROUTE
router.delete("/:id", function(req, res) {
  Goodthing.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  })
});

module.exports = router;