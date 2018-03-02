var express = require('express');
var expressSanitizer = require("express-sanitizer");
var router = express.Router();
var Post = require("./models/post");
var Post = require("./models/goodthings");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/jar_app");

// schema setup
// post schema


router.use(expressSanitizer());
/* GET goodthings page. */
router.get('/', function(req, res, next) {
//   get all goodthings from DB
    Goodthing.find({}, function(err, postData){
      if(err){
        console.log(err);
      }else{
         res.render('goodthings', {title: 'Good Thing Jar - One', posts: postData
        }); 
      }
    });
});

/* GET index page */ 
router.get('/all', function(req, res, next) {
  
//   var rand = posts[Math.floor(Math.random() * posts.length)];
//   console.log(rand);
  console.log('index via goodthing');
  
//     Goodthing.find({}, function(err, postData){
//       if(err){
//         console.log(err);
//       }else{
//          res.render('all', {title: 'Good Thing Jar', posts: postData
//         }); 
//       }
//     });
  User.findOne({email: "bob@gmail.com"}).populate("goodthings").exec(function(err, user){
    if(err){
      console.log(err)
    } else {
      res.render('all', {title: 'Good Thing Jar', posts: user.goodthings});
      console.log(user);
    }
  });
});

// CREATE
router.post('/', function(req, res){
  var memory = req.sanitize(req.body.memory);
  var date = new Date();
  var newMessage = {author: "Dick Fink", memory: memory, date: date};
  console.log(newMessage);
  Goodthing.create(newMessage, function(err, newlyCreated){
    if(err){
      console.log(err);
    }else{
      User.findOne({email: "bob@gmail.com"}, function(err, foundUser){
        if(err){
          console.log(err);
        } else {
          foundUser.goodthings.push(newlyCreated._id);
          foundUser.save(function(err, data){
            if(err){
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
  res.render('new', { title: 'Good Thing Jar - New Post'});
});

router.get('/:id', function(req, res, next) {
//   res.render('single', { title: 'Good Thing Jar - One Post'});
//   res.send("this will be the show page one day")
//     console.log(req.params.id);
    Goodthing.findById(req.params.id, function(err, postData){
    if(err){
      console.log(err);
    }else{
       res.render('onegoodthing', {title: 'Good Thing Jar - One', posts: postData
      }); 
    }
    });
});
// EDIT A POST
router.get('/:id/edit', function(req, res, next){
Goodthing.findById(req.params.id, function(err, postData){
    if(err){
      console.log(err);
    }else{
       res.render('edit', {title: 'Good Thing Jar - Edit', posts: postData
      }); 
    }
    });
});
// UPDATE ROUTE
router.put("/:id", function(req, res){
  Goodthing.update( {_id: req.params.id}, {memory: req.sanitize(req.body.memory)}, function(err, updatedGoodThing){
    if(err){
      console.log(err);
      res.redirect('/');
    }else{
//       console.log(req.params.id);
      console.log("Post ID " + req.params.id +" memory: " + req.body.memory);
      res.redirect("/" + req.params.id);
    }
  })
});

// DELETE ROUTE
router.delete("/:id", function(req, res){
  Goodthing.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/");
    }else{
      res.redirect("/");
    }
  })
});

module.exports = router;