const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require('multer');
const jwt = require("jsonwebtoken");

const checkAuthentication = require('../middleware/Auth');


const storage = multer.diskStorage({
    destination: function(req, file, callbackfun) {
      callbackfun(null, './uploads/');
    },
    filename: function(req, file, callbackfun) {
      callbackfun(null, file.originalname);
    }
  });
  
  const fileFilter = (req, file, callbackfun) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callbackfun(new Error('message : File went wrong while saving'), true); 
    } else {
      callbackfun(new Error('message : please choose png or jpg pic format only'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 3
    },
    fileFilter: fileFilter
  });


const User = require("../models/user");


////////////////////////--SIGN UP--///////////////////////////////////


router.post("/signup", upload.single('avatarImage') ,(req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "try another mail , this mail already exist"
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
                userName : req.body.userName ,
                email: req.body.email ,
                password: hash ,
                firstName : req.body.firstName ,
                lasName : req.body.lasName ,
                avatarImage : req.file.path
              });
              user
                .save()
                .then(result => {
                  if(user.avatarImage == null){
                    res.status(404).json({
                      message: "image not found please add one"
                    })
                  }
                  console.log(result);
                  res.status(201).json({
                    message: "User has successfully created"
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


////////////////////////--LOGIN--///////////////////////////////////


  router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(404).json({
            message: "Email not found"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Authentcation failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_TOKEN,
              {
                  expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Authentcation successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Authentcation failed"
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


  ////////////////////////--UPDATE--///////////////////////////////////

  router.patch("/:userID", checkAuthentication, (req, res, next) => {
    const id = req.params.userId;
    const updates = {};
    for (const indexx of req.body) {
      updates[indexx.propName] = indexx.value;
    }
    User.update({ _id: id }, { $set: updates })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Profile updated',
           
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


module.exports = router;
