const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/model_user");

const router = express.Router();

// *************** SignUp ****************//
router.post("/signup", (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email Already Exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "SignUp Successful"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          } 
        });
      }
    });
});

// **************** Login ****************//
router.post("/login", (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Login failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Error Occured"
          });
        }
        if (result) {
          const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            'nuralam', { // any string value
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Login Successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Login failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//*************** Get all User ***************
router.get('/alluser', (req, res, next) =>  {
  User.find()
      .then(users => {
          res.json ({
              users
          });
      })
      .catch(error => {
          res.json ({
              error
          });
      });
});


module.exports = router;