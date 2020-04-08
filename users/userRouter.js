const express = require('express');
const User = require('./userDb');
const Post = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // add new user to db
  User.insert(req.body)
  .then(newUser => {
    console.log(`welcome new user ${newUser.name}`);
    res.status(201).json(newUser);
  })
  .catch(err => res.status(500).json({ errorMessage: "Oops! Something went wrong." }))
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // add a new user post
  Post.insert(req.body)
  .then(newPost => {
    console.log(`new post created! check it out:`);
    console.log(newPost);
    res.status(201).json(newPost);
  })
  .catch(err => res.status(500).json({ errorMessage: "Oops! Something went wrong." }))
});

router.get('/', (req, res) => {
  // read all users
  User.get()
  .then(users => {
    console.log(users);
    res.status(200).json(users);
  })
  .catch(err => res.status(500).json({ errorMessage: "Oops! Something went wrong." }))
});

router.get('/:id', validateUserId, (req, res) => {
  // read user by id
  User.getById(req.params.id)
  .then(thisUser => {
    console.log(thisUser);
    res.status(200).json(thisUser)
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // read all posts associated with this user 
  User.getUserPosts(req.params.id)
  .then(posts => {
    console.log("these are all the posts associated with this user");
    console.log(posts);
    res.status(200).json(posts);
  })
  .catch(err => res.status(500).json({ errorMessage: "Oops! Something went wrong." }))  
});

router.delete('/:id', validateUserId, (req, res) => {
  // delete user with this id
  User.remove(req.params.id)
  .then(response => {
    console.log(response);
    if(response === 1){
      res.status(200).json({ message: "user removed"})
    } else if(response === 0){
      res.status(500).json({ message: "could not remove user" })
    }
  })
  .catch(err => res.status(500).json({ errorMessage: "Oops! Something went wrong." }))  
});

router.put('/:id', validateUserId, (req, res) => {
  // update user with this id
  const id = req.params.id;
  const updatedUser = req.body;
  User.update(id, updatedUser)
  .then(result => {
    console.log(result);
    if(result === 1){
      res.status(200).json({ message: "user updated!"})
    } else {
      res.status(500).json({ errorMessage: "could not update user"})
    }
  })
  .catch(err => res.status(500).json({ errorMessage: "Oops! Something went wrong." }))
});

//custom middleware

function validateUserId(req, res, next) {
  let id = req.params.id;
  User.getById(id)
  .then(foundUser => {
    if(!foundUser){
      res.status(400).json({ errorMessage: "invalid user id"});
    } else {
      req.user = foundUser;
      next();
    }    
  })
  .catch(err => {
    res.status(400).json({ errorMessage: "invalid user id"})
  })
}

function validateUser(req, res, next) {
  if(!req.body){
    res.status(400).json({ message: "missing user data"})
  } else if(!req.body.name){
    res.status(400).json({ message: "missing required name field"})
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if(!req.body){
    res.status(400).json({ message: "missing post data"})
  } else if(!req.body.text || !req.body.user_id){
    res.status(400).json({ message: "missing required text or user_id field"})
  } else {
    console.log("post looks good, moving on");
    next();
  }
}

module.exports = router;
